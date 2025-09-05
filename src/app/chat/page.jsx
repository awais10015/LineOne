"use client";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loader from "@/components/Loader";
import Image from "next/image";
import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdOutlineAddComment } from "react-icons/md";
import { RiUserSearchFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Router } from "lucide-react";

const page = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [chats, setchats] = useState([]);
  const [groupChats, setgroupChats] = useState([]);
  const [loader, setloader] = useState(false);
  const router = useRouter();

  const fetchChatsBasic = async () => {
    setloader(true);
    try {
      const res = await fetch(`/api/chat/basic/${currentLoggedInUser?._id}`);
      const data = await res.json();
      console.log(data);
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
    if (!currentLoggedInUser) return;
    fetchChatsBasic();
  }, []);

  useEffect(() => {
    console.log(chats);
    console.log(groupChats);
  }, [chats]);

  return (
    <>
      <div className="absolute bottom-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="cursor-pointer flex items-center justify-center  rounded-full  w-12 h-12 bg-[#ff6500] hover:scale-105">
              <MdOutlineAddComment size={28} className="text-white"/>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="h-full w-full bg-transparent border-none shadow-none ">
            <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
              <Button
                onClick={() => router.push("/searchUser")}
                className="cursor-pointer w-full gap-2 flex items-start justify-start bg-transparent hover:bg-transparent text-[#ff6500] rounded-full p-3"
              >
                <RiUserSearchFill size={38} />{" "}
                <span className="text-black dark:text-white">Search User</span>
              </Button>
              <Button
                onClick={() => router.push("/creategroup")}
                className="cursor-pointer w-full gap-2 flex items-start justify-start  bg-transparent hover:bg-transparent text-[#ff6500] rounded-full p-3"
              >
                <FaUsers size={38} />{" "}
                <span className="text-black dark:text-white">Create Group</span>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:flex md:flex-col w-full h-screen items-center justify-center gap-10">
        <Image src={"/chatPage2.svg"} alt="chat" width={400} height={400} />
        <h1 className="text-lg font-bold text-gray-500">
          Select/Start a Chat or Group
        </h1>
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
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const otherUser = chat.participants.find(
                    (p) => p._id !== currentLoggedInUser._id
                  );

                  return (
                    <Link
                      href={`/chat/${chat._id}`}
                      key={chat._id}
                      className="w-full"
                    >
                      <div className="w-full flex items-start gap-3 p-2 pl-4 border-b">
                        <div className="w-13 h-13 rounded-full overflow-hidden">
                          <Image
                            src={otherUser?.profilePic || "/default.png"}
                            alt="dp"
                            width={55}
                            height={55}
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="pl-2 flex flex-col justify-start items-start">
                          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                            {otherUser.name}
                          </h1>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                            {chat?.lastMessage?.text
                              ? chat.lastMessage.text
                              : "No Message Yet"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="w-full flex flex-col h-[600px] items-center justify-center gap-10">
                  <Image
                    src={"/searchUser.svg"}
                    alt="chat"
                    width={150}
                    height={150}
                  />
                  <h1 className="mt-3 text-gray-400 font-medium">
                    Start chat with Someone
                  </h1>
                </div>
              )}
            </TabsContent>

            <TabsContent
              value="groupchats"
              className="w-full flex flex-col justify-start items-start"
            >
              {groupChats.length > 0 ? (
                groupChats.map((chat) => {
                  return (
                    <Link
                      href={`/chat/${chat._id}`}
                      key={chat._id}
                      className="w-full"
                    >
                      <div className="w-full flex items-center gap-3 p-2 pl-4 border-b">
                        <div className="w-13 h-13 rounded-full overflow-hidden">
                          <Image
                            src={chat?.groupIcon || "/default.png"}
                            alt="dp"
                            width={55}
                            height={55}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="pl-2 flex flex-col justify-start items-start">
                          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                            {chat?.name}
                          </h1>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[220px]">
                            {chat?.lastMessage?.text
                              ? chat.lastMessage.text
                              : "No Message Yet"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="w-full flex flex-col h-[600px] items-center justify-center gap-10">
                  <Image
                    src={"/createGroup.svg"}
                    alt="chat"
                    width={150}
                    height={150}
                  />
                  <h1 className="mt-3 text-gray-400 font-medium">
                    Create/Join a Group
                  </h1>
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
