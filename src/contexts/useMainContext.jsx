import * as React from "react";

export const MainContext = React.createContext();

export const useMainContext = () => {
  const mainContext = React.useContext(MainContext);
  if (!mainContext) throw new Error("useMainContext called without MainContext!");
  return mainContext;
};
