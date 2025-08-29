"use client";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/Loader";
import Image from "next/image";
import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";

const page = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [chats, setchats] = useState([]);
  const [groupChats, setgroupChats] = useState([]);
  const [loader, setloader] = useState(false);

  const fetchChatsBasic = async () => {
    setloader(true);
    try {
      const res = await fetch(`/api/chat/basic/${currentLoggedInUser?._id}`);
      const data = await res.json();
      console.log(data)
      const filterBasicChats = data.filter((chat) => chat.isGroup === false);
      const filterGroupChats = data.filter((chat) => chat.isGroup === true);
      setchats([...filterBasicChats]);
      setgroupChats([...filterGroupChats]);
      setloader(false);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };
  useEffect(() => {
    if(!currentLoggedInUser) return;
    fetchChatsBasic();
  }, []);

  useEffect(() => {
    console.log(chats);
    console.log(groupChats);
  }, [chats]);

  return (
    <>
      <div className="hidden md:flex md:flex-col w-full h-screen items-center justify-center">
        <Image src={"/chatPage2.svg"} alt="chat" width={400} height={400}/>
      </div>

      {/* Sirf Mobile pr Chats Preview */}
      <div className="w-full flex flex-col md:hidden items-center justify-between mt-2">
        {loader ? (
          <Loader />
        ) : (
          <Tabs
            defaultValue="chats"
            className="w-full flex flex-col items-center justify-center"
          >
            <TabsList>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="groupchats">Groups</TabsTrigger>
            </TabsList>
            <TabsContent
              value="chats"
              className="w-full flex flex-col justify-start items-start"
            >
              {chats.map((chat) => {
                const otherUser = chat.participants.find(
                  (p) => p._id !== currentLoggedInUser._id
                );

                return (
                  <Link
                    href={`/chat/${chat._id}`}
                    key={chat._id}
                    className="w-full"
                  >
                    <div className="w-full flex items-center gap-3 p-2 border-b">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={otherUser?.profilePic || "/default.png"}
                          alt="dp"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <h1 className="font-medium">{otherUser?.name}</h1>
                    </div>
                  </Link>
                );
              })}
            </TabsContent>

            <TabsContent
              value="groupchats"
              className="w-full flex flex-col justify-start items-start"
            >
              {groupChats.length>0 ? (
                groupChats.map((chat) => {
                  return (
                    <Link
                      href={`/chat/${chat._id}`}
                      key={chat._id}
                      className="w-full"
                    >
                      <div className="w-full flex items-center gap-3 p-2 border-b">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={chat?.groupIcon || "/default.png"}
                            alt="dp"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <h1 className="font-medium">{chat?.name}</h1>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="w-full h-[400px] flex justify-center items-center">
                  <p className="text-sm font-medium text-gray-400">
                    Join or Create Group
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default page;
