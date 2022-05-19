import React from "react";
import { buy, getconnection, getcurrentuserbuyinfo } from "./api";

export const App = () => {
  return (
    <>
      <button
        onClick={() => {
          getconnection();
        }}
      >
        CONNECT
      </button>

      <button
        onClick={() => {
          buy();
        }}
      >
        BUY
      </button>

      <button
        onClick={() => {
          getcurrentuserbuyinfo();
        }}
      >
        CURRENT USER BUY INFO LOGS
      </button>
    </>
  );
};
