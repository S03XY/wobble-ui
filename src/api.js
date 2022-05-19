import {
  Connection,
  clusterApiUrl,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import idl from "./idl.json";
import * as anchor from "@project-serum/anchor";
import * as Buffer from "buffer";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const Network = "devnet";
const BUYER = "buyer";

const opts = {
  preflightCommitment: "processed",
};

export const getconnection = async () => {
  await window.solana.connect();
};

export const buy = async () => {
  console.log("running buy instruction...");
  const connection = new Connection(clusterApiUrl(Network));
  const wallet = window.solana;

  const tokenmint = new PublicKey(
    "5bQgFyYBjCeyzwWvVxwfuauVzGaGcUBCvNhRLNKrPUy9"
  );

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    opts.preflightCommitment
  );

  console.log("provider", provider);
  const receiver = new PublicKey(
    "8WiSJ8Z92Rc6SMnbFNV5GdSr1YTnFP9gQ7NwCjhgYKJE"
  );

  const getreceiverata = await connection.getTokenAccountsByOwner(receiver, {
    mint: tokenmint,
  });

  let destination;

  if (getreceiverata.value.length === 0) {
    alert("reciver doesnt own token mint");
  } else {
    destination = getreceiverata.value[0];
  }
  console.log(wallet);

  const getsourceata = await connection.getTokenAccountsByOwner(
    wallet._publicKey,
    {
      mint: tokenmint,
    }
  );

  let source;

  if (getsourceata.value.length === 0) {
    alert("you dont own token mint");
    return;
  } else {
    source = getsourceata.value[0];
  }

  console.log({ source });
  console.log({ destination });

  const program = new anchor.Program(
    idl,
    new PublicKey(idl.metadata.address),
    provider
  );

  const [currentBuyer, bump] = await PublicKey.findProgramAddress(
    [Buffer.Buffer.from(BUYER)],
    new PublicKey(idl.metadata.address)
  );

  let getcurrentbuyeraccount;
  try {
    // Buying subsequent time

    getcurrentbuyeraccount = await program.account.user0.fetch(currentBuyer);
    console.log("processing.....");
    const tx = await program.methods
      .buySong()
      .accounts({
        user0: currentBuyer,
        wallet: wallet._publicKey,
        tokenmint: tokenmint,
        tokenProgramId: TOKEN_PROGRAM_ID,
        source: source.pubkey,
        destination: destination.pubkey,
      })
      .rpc();

    console.log("buying subsequent time tx", tx);
    return;
  } catch (err) {
    // Buying first time

    console.log(err);

    console.log("processing.....");
    const tx = await program.methods
      .buyFirstSong()
      .accounts({
        user0: currentBuyer,
        user: wallet._publicKey,
        tokenmint: tokenmint,
        tokenProgramId: TOKEN_PROGRAM_ID,
        source: source.pubkey,
        destination: destination.pubkey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("buying first time tx", tx);
    return;
  }

  //   console.log(program)
};

export const getcurrentuserbuyinfo = async () => {
  const [currentBuyer, bump] = await PublicKey.findProgramAddress(
    [Buffer.Buffer.from(BUYER)],
    new PublicKey(idl.metadata.address)
  );
  const connection = new Connection(clusterApiUrl(Network));
  const wallet = window.solana;

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    opts.preflightCommitment
  );

  const program = new anchor.Program(
    idl,
    new PublicKey(idl.metadata.address),
    provider
  );

  let getcurrentbuyeraccount;
  try {
    getcurrentbuyeraccount = await program.account.user0.fetch(currentBuyer);
    console.log(getcurrentbuyeraccount);
  } catch (err) {
    alert("user didnot bought anything till yet");
    return;
  }
};
