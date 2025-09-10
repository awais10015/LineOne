"use client";
import Loader from "@/components/Loader";
import { Select, Space } from "antd";
import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CurrentUserContext from "@/context/CurrentUserContext";
import { LogOut, Send, UserRoundMinus, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import Pusher from "pusher-js";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Chat = () => {
  const { id } = useParams();
  const router = useRouter();
  const [chat, setChat] = useState(null);
  const [loader, setLoader] = useState(false);
  const [sendLoader, setSendLoader] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [replyOf, setReplyOf] = useState(null);
  const [selectUsers, setselectUsers] = useState("");
  const [options, setoptions] = useState("");
  const [addMembers, setaddMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat?._id) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: "ap2",
    });

    const channel = pusher.subscribe(`chat-${chat._id}`);

    channel.bind("new-message", (data) => {
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, data.message],
      }));
      scrollToBottom();
    });

    return () => {
      pusher.unsubscribe(`chat-${chat._id}`);
      pusher.disconnect();
    };
  }, [chat?._id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getUsers = async () => {
    if (!chat) return;
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      setAllUsers(data.users);

      const participantIds = chat?.participants?.map((p) => p._id) || [];

      const filteredUsers = data.users.filter(
        (user) =>
          user._id !== currentLoggedInUser._id &&
          !participantIds.includes(user._id)
      );

      setselectUsers(filteredUsers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, [chat]);
  useEffect(() => {
    if (!selectUsers) return;
    setoptions(
      selectUsers?.map((user) => ({
        label: user.name,
        value: user._id,
        profilePic: user.profilePic,
        username: user.username,
      }))
    );
  }, [selectUsers]);

  const handleChange = (value) => {
    setaddMembers([...value]);
  };
  useEffect(() => {
    console.log(addMembers);
  }, [addMembers]);

  useEffect(() => {
    if (!chat) return;
    if (chat?.messages?.length) {
      scrollToBottom();
    }
  }, [chat?.messages]);

  useEffect(() => {
    if (!sendLoader) {
      scrollToBottom();
    }
  }, [sendLoader]);
  const getChat = async () => {
    setLoader(true);
    try {
      const res = await fetch(`/api/chat/${id}`);
      const data = await res.json();

      const isParticipant = data?.participants?.some(
        (p) => p._id === currentLoggedInUser._id
      );

      if (!isParticipant) {
        toast.error("You are not part of this chat now.");
        router.push("/chat");
        return;
      }

      setChat(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getChat();
  }, []);

  const leaveGroup = async () => {
    setLoader(true);
    try {
      const res = await fetch(`/api/chat/${id}/remove-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: currentLoggedInUser._id }),
      });

      if (res.ok) {
        setLoader(false);
        console.log(currentLoggedInUser._id, "left group");
        router.push("/chat");
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  const adminRemoveMembers = async (userId) => {
    try {
      const res = await fetch(`/api/chat/${id}/remove-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: [userId] }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to remove member");
      }

      const data = await res.json();
      console.log("✅ Removed a user:", data);

      setChat((prev) => ({
        ...prev,
        participants: prev.participants.filter((user) => user._id !== userId),
      }));

      const removedUser = allUsers.find((u) => u._id === userId);
      if (removedUser) {
        setselectUsers((prev) => [...prev, removedUser]);
      }
    } catch (error) {
      console.error("❌ Error removing member:", error);
    }
  };

  const adminAddMembers = async () => {
    if (!addMembers || addMembers.length === 0) return;

    try {
      const res = await fetch(`/api/chat/${id}/add-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: addMembers }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add members");
      }

      const data = await res.json();
      console.log("✅ Members added successfully:", data);

      const newMembers = selectUsers.filter((user) =>
        addMembers.includes(user._id)
      );

      setChat((prev) => ({
        ...prev,
        participants: [...prev.participants, ...newMembers],
      }));

      setaddMembers([]);
    } catch (error) {
      console.error("❌ Error adding members:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text) return;
    setSendLoader(true);
    try {
      const res = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: id,
          senderId: currentLoggedInUser._id,
          sentTo: chat.participants,
          text: text,
          media: media,
          replyOf: replyOf,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      console.log("Message sent:", data);
      setText("");
      setSendLoader(false);
    } catch (err) {
      console.error(err);
      setSendLoader(false);
    }
  };

  useEffect(() => {
    console.log(chat);
    console.log("Group ha k nhi ", chat?.isGroup);
  }, [chat]);

  if (loader) return <Loader />;

  if (!chat) return null;

  const otherUser =
    !chat?.isGroup &&
    chat?.participants?.find((p) => p._id !== currentLoggedInUser._id);

  return (
    <>
      {chat?.isGroup ? (
        <div className="w-full flex items-start justify-center">
          <div
            className="bg-white dark:bg-black rounded-2xl w-full max-w-4xl z-1000 absolute md:relative 
                  top-0 left-0 flex flex-col h-[100dvh] md:h-screen overflow-hidden scrollbar-hide"
          >
            <div className="basis-[10%] md:basis-[5%] flex justify-start items-center gap-2 rounded-t-2xl p-2">
              <Link href={"/chat"}>
                <Button className="cursor-pointer bg-transparent hover:bg-transparent shadow-none border-none hover:scale-115 transition duration-150">
                  <FaArrowLeft />
                </Button>
              </Link>
              <div className="w-full flex justify-between items-center gap-5">
                <Dialog>
                  <DialogTrigger className="w-full">
                    <div className="flex items-center gap-2 cursor-pointer hover:scale-102 transition duration-80">
                      <div className="relative h-[45px] w-[45px] rounded-full overflow-hidden">
                        <Image
                          src={chat?.groupIcon}
                          alt="Group Icon"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-start ">
                        <h1 className="text-md text-start font-semibold text-gray-900 dark:text-gray-100">
                          {chat?.name}
                        </h1>
                        <p className="text-sm text-start text-gray-500 dark:text-gray-400">
                          {chat?.participants?.length} members
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="z-1000 px-0">
                    <DialogHeader>
                      <DialogTitle>
                        <div className="w-full flex flex-col items-center justify-center gap-5">
                          <div className="relative h-[90px] w-[90px] rounded-full overflow-hidden">
                            <Image
                              src={chat?.groupIcon}
                              alt="Group Icon"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col justify-center items-center ">
                            <h1 className="text-md text-start font-semibold text-gray-900 dark:text-gray-100">
                              {chat?.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {chat?.participants?.length} members
                            </p>
                          </div>
                        </div>
                      </DialogTitle>
                      <DialogDescription asChild>
                        <Card className="h-[450px] overflow-y-auto scrollbar-hide w-full p-0 gap-1 border-none shadow-none">
                          <CardHeader className="items-start px-3">
                            <CardTitle>Admin</CardTitle>
                            <CardDescription className="">
                              <div className="flex items-center justify-between p-2 rounded-lg">
                                <Link href={`/userprofile/${chat?.admin._id}`}>
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        chat?.admin.profilePic ||
                                        "/default-avatar.png"
                                      }
                                      alt={chat?.admin.name}
                                      className="w-10 h-10 rounded-full object-cover object-top"
                                    />
                                    <div>
                                      <p className="font-medium text-black dark:text-white flex items-center gap-2">
                                        {chat?.admin.name}
                                        <span className="text-xs bg-[#ff6500]/15 text-[#ff6500] px-2 py-0.5 rounded-full">
                                          Admin
                                        </span>
                                      </p>
                                      <p className="text-sm text-start text-gray-500">
                                        {chat?.admin.username}
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {currentLoggedInUser?._id ===
                                  chat?.admin._id && (
                                  <div className="">
                                    <Dialog>
                                      <DialogTrigger>
                                        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-[#ff6500]/20 text-[#ff6500] hover:bg-[#ff6500] hover:text-white cursor-pointer transition-colors duration-200">
                                          <UserRoundPlus />
                                          Add Members
                                        </div>
                                      </DialogTrigger>
                                      <DialogContent className="z-2000">
                                        <DialogHeader>
                                          <DialogTitle>Add Users</DialogTitle>
                                          <DialogDescription asChild>
                                            <Select
                                              value={addMembers}
                                              mode="multiple"
                                              style={{ width: "100%" }}
                                              className="z-3000"
                                              placeholder="Select users to add in group"
                                              onChange={handleChange}
                                              options={options}
                                              showSearch
                                              optionFilterProp="label"
                                              getPopupContainer={(trigger) =>
                                                trigger.parentNode
                                              }
                                              filterOption={(input, option) =>
                                                option?.label
                                                  .toLowerCase()
                                                  .includes(
                                                    input.toLowerCase()
                                                  ) ||
                                                option?.username
                                                  ?.toLowerCase()
                                                  .includes(input.toLowerCase())
                                              }
                                              optionRender={(option) => (
                                                <Space>
                                                  <img
                                                    src={
                                                      option.data.profilePic ||
                                                      "/default.png"
                                                    }
                                                    alt={option.data.label}
                                                    className="w-6 h-6 rounded-full object-cover object-top"
                                                  />
                                                  <span>
                                                    {option.data.label}
                                                  </span>
                                                  <span className="text-gray-400 text-xs">
                                                    {option.data.username}
                                                  </span>
                                                </Space>
                                              )}
                                            />
                                          </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex justify-end mt-4">
                                          <Button
                                            onClick={adminAddMembers}
                                            className="cursor-pointer bg-[#ff6500] hover:bg-[#e45b00] text-white px-4 py-2 rounded-lg"
                                          >
                                            Add Members
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                )}
                              </div>
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="w-full h-[340px] px-3 overflow-y-auto scrollbar-hide flex flex-col ">
                            <div className="mt-1">Members</div>
                            {chat?.participants?.map((user) => (
                              <div
                                key={user?._id}
                                className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                              >
                                <Link href={`/userprofile/${user?._id}`}>
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={
                                        user?.profilePic ||
                                        "/default-avatar.png"
                                      }
                                      alt={user?.name}
                                      className="w-10 h-10 rounded-full object-cover object-top"
                                    />
                                    <div>
                                      <p className="font-medium text-black dark:text-white flex items-center gap-2">
                                        {user?.name}

                                        {user?._id === chat?.admin._id && (
                                          <span className="text-xs bg-[#ff6500]/15 text-[#ff6500] px-2 py-0.5 rounded-full">
                                            Admin
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-sm text-start text-gray-500">
                                        {user?.username}
                                      </p>
                                    </div>
                                  </div>
                                </Link>

                                {user?._id === currentLoggedInUser?._id ? (
                                  <span className="text-sm text-gray-400">
                                    You
                                  </span>
                                ) : currentLoggedInUser?._id ===
                                  chat?.admin._id ? (
                                  <Button
                                    onClick={() => {
                                      adminRemoveMembers(user?._id);
                                    }}
                                    className="cursor-pointer bg-transparent hover:bg-transparent shadow-none text-red-500 hover:text-red-600"
                                  >
                                    <UserRoundMinus />
                                  </Button>
                                ) : (
                                  <FollowUnfollowButton
                                    currentLoggedInUser={currentLoggedInUser}
                                    id={user?._id}
                                    refresh={getChat}
                                  />
                                )}
                              </div>
                            ))}
                          </CardContent>

                          <CardFooter className="flex justify-end">
                            {currentLoggedInUser._id === chat?.admin._id ? (
                              <div></div>
                            ) : (
                              <Button
                                onClick={leaveGroup}
                                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md transition-all duration-300 ease-in-out"
                              >
                                <LogOut size={20} className="text-white" />
                                Leave Group
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="w-5">
                      <BsThreeDotsVertical
                        size={20}
                        className="cursor-pointer hover:scale-110 transition duration-150"
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-1000">
                    <DropdownMenuItem
                      onClick={leaveGroup}
                      className="cursor-pointer text-black dark:text-white"
                    >
                      {" "}
                      <LogOut
                        size={40}
                        className="text-black dark:text-white"
                      />{" "}
                      Leave
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="basis-[80%] md:basis-[90%] overflow-y-auto scrollbar-hide py-2 px-2">
              <div className="flex flex-col gap-1">
                {chat?.messages?.map((msg, index) => {
                  const isOwnMessage =
                    msg.sentBy._id === currentLoggedInUser._id;
                  const prevMsg = chat?.messages[index - 1];
                  const isSameSender =
                    prevMsg && prevMsg.sentBy._id === msg.sentBy._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-start ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isOwnMessage && (
                        <div className="w-8 mr-2 flex-shrink-0">
                          {!isSameSender ? (
                            <Link href={`/userprofile/${msg.sentBy?._id}`}>
                              <img
                                src={msg.sentBy?.profilePic || "/default.png"}
                                alt="dp"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            </Link>
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>
                      )}

                      <div className="flex flex-col max-w-[70%]">
                        {!isOwnMessage
                          ? !isSameSender && (
                              <span className="text-xs font-medium text-gray-500 mb-1">
                                {msg.sentBy?.name}
                              </span>
                            )
                          : !isSameSender && (
                              <span className="text-xs text-end font-medium text-gray-500 mb-1">
                                You
                              </span>
                            )}

                        <div
                          className={`px-4 py-2 rounded-2xl text-sm flex flex-col ${
                            isOwnMessage
                              ? "bg-[#ff6500] text-white rounded-tr-none self-end"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                          }`}
                        >
                          <span>{msg.text}</span>
                          <span className="text-[10px] mt-1 self-end">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="basis-[10%] md:basis-[5%]">
              <div className="w-full px-2 py-2 bg-white dark:bg-black h-full flex items-end">
                <form
                  onSubmit={sendMessage}
                  className="flex gap-2 items-end w-full"
                >
                  <div className="flex-1 flex flex-col">
                    <Input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Type your Message..."
                      className="flex-1 min-w-[150px] rounded-full bg-white dark:bg-gray-800 px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 hover:scale-101 transition duration-150"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-[#ff6500] flex hover:scale-105 transition duration-150"
                  >
                    {sendLoader ? (
                      <Loader size={5} color="#FFFFFF" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        otherUser && (
          <div className="w-full flex items-start justify-center">
            <div
              className="bg-white dark:bg-black rounded-2xl w-full max-w-4xl z-1000 absolute md:relative 
                  top-0 left-0 flex flex-col h-[100dvh] md:h-screen overflow-hidden scrollbar-hide"
            >
              <div className="basis-[10%] md:basis-[5%] flex justify-start items-start gap-2 rounded-t-2xl p-2">
                <Link href={"/chat"}>
                  <Button className="cursor-pointer bg-transparent hover:bg-transparent shadow-none border-none hover:scale-115 transition duration-150">
                    <FaArrowLeft />
                  </Button>
                </Link>

                <Link href={`/userprofile/${otherUser?._id}`}>
                  <div className="flex items-center gap-2 hover:scale-102 transition duration-150 cursor-pointer">
                    <div className="relative h-[45px] w-[45px] rounded-full overflow-hidden">
                      <Image
                        src={otherUser?.profilePic}
                        alt="DP"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h1 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                        {otherUser?.name}
                      </h1>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="basis-[80%] md:basis-[90%] overflow-y-auto scrollbar-hide py-2 px-2">
                {chat?.messages?.map((msg) => {
                  const isOwnMessage =
                    msg.sentBy._id === currentLoggedInUser._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex mb-1 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm flex flex-col ${
                          isOwnMessage
                            ? "bg-[#ff6500] text-white rounded-tr-none"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none"
                        }`}
                      >
                        <span>{msg.text}</span>
                        <span className="text-[10px] mt-1 self-end">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="basis-[10%] md:basis-[5%]">
                <div className="w-full px-2 py-2 bg-white dark:bg-black h-full flex items-end">
                  <form
                    onSubmit={sendMessage}
                    className="flex gap-2 items-end w-full"
                  >
                    <div className="flex-1 flex flex-col">
                      <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type your Message..."
                        className="flex-1 min-w-[150px] rounded-full bg-white dark:bg-gray-800 px-4 py-2 focus-visible:ring-0 focus-visible:ring-offset-0 hover:scale-101 transition duration-150"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="icon"
                      className="rounded-full bg-[#ff6500] flex hover:scale-105 transition duration-150"
                    >
                      {sendLoader ? (
                        <Loader size={5} color="#FFFFFF" />
                      ) : (
                        <Send className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default Chat;
