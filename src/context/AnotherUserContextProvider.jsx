"use client"
import React, { useState } from "react";
import AnotherUserContext from "./AnotherUserContext";

const AnotherUserContextProvider = ({ children }) => {
  const [AnotherUser, setAnotherUser] = useState(null);


  return (
    <AnotherUserContext.Provider value={{ AnotherUser, setAnotherUser }}>
      {children}
    </AnotherUserContext.Provider>
  );
};

export default AnotherUserContextProvider;
