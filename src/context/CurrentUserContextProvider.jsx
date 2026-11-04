"use client"
import React, { useEffect, useState } from "react";
import CurrentUserContext from "./CurrentUserContext";
import Loader from "@/components/Loader";
import { parseJsonResponse } from "@/lib/parseJsonResponse";

const CurrentUserContextProvider = ({ children }) => {
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      if(currentLoggedInUser) return;
      try {
        const res = await fetch("/api/currentUser");
        const data = await parseJsonResponse(res, { user: null });
        setCurrentLoggedInUser(data.user ?? null);
      } catch (err) {
        console.error("Failed to fetch user in context:", err);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) return <Loader />

  return (
    <CurrentUserContext.Provider value={{ currentLoggedInUser, setCurrentLoggedInUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserContextProvider;
