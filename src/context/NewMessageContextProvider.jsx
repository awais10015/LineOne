"use client";
import React, { useContext, useState } from "react";
import NewMessageContext from "./NewMessageContext";
import CurrentUserContext from "@/context/CurrentUserContext";

const NewMessageContextProvider = ({ children }) => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [newMessages, setNewMessages] = useState(
    currentLoggedInUser?.newMessages
  );
  const [newMessagesCount, setnewMessagesCount] = useState(newMessages?.length);

  return (
    <NewMessageContext.Provider
      value={{
        newMessages,
        setNewMessages,
        newMessagesCount,
        setnewMessagesCount,
        resetChatMessages: (chatId) => {
          setNewMessages(
            (prev) => prev?.filter((msg) => msg.chat !== chatId) || []
          );
          setnewMessagesCount((prev) => {
            const chatMsgs =
              newMessages?.filter((msg) => msg.chat === chatId)?.length || 0;
            return prev - chatMsgs >= 0 ? prev - chatMsgs : 0;
          });
        },
      }}
    >
      {children}
    </NewMessageContext.Provider>
  );
};

export default NewMessageContextProvider;
