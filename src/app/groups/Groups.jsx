"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CurrentUserContext from "@/context/CurrentUserContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const Groups = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [groups, setGroups] = useState([]);
  const [searchWord, setSearchWord] = useState(null);
  const [searchedGroups, setSearchedGroups] = useState([]);
  const [loader, setloader] = useState(false);
  const router = useRouter()
  const fetchGroups = async () => {
    setloader(true);
    try {
      const res = await fetch(`/api/groups`);
      const data = await res.json();
      const filterGroupChats = data.filter((chat) => chat.isGroup === true);
      setGroups([...filterGroupChats]);
      setloader(false);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };
  useEffect(() => {
    console.log(currentLoggedInUser?._id);
  }, [currentLoggedInUser]);

  useEffect(() => {
    fetchGroups();
  }, []);
  const wordToSearch = () => {
    if (!searchWord) {
      setSearchedGroups([...groups]);
      return;
    }
    const matchedGroups = groups.filter((group) =>
      group?.name?.toLowerCase().includes(searchWord.toLowerCase())
    );

    setSearchedGroups(matchedGroups);
  };

  useEffect(() => {
    wordToSearch();
  }, [searchWord, groups]);

  const joinGroup = async (groupId) => {
    if (!groupId) {
      console.log("groupId missing");
      return;
    }
    try {
      const res = await fetch(`/api/chat/${groupId}/add-member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: [currentLoggedInUser._id] }),
      });

      if (res.ok) {
        console.log(currentLoggedInUser._id, "joined group");
        router.push(`/chat/${groupId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex items-start justify-center mt-5">
        <div className="w-full max-w-4xl px-3 pb-5 flex items-center justify-center flex-col gap-10 rounded-2xl overflow-hidden srollbar-hide">
          <div className="relative w-full max-w-sm">
            <Input
              className="pl-10 focus:outline-none focus:ring-none"
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
            </span>
          </div>

          <div className="flex w-full flex-col gap-6">
            <Card className="p-0 pt-4 border-none gap-1 shadow-none">
              <CardHeader className="p-0 pl-2">
                <CardTitle>Groups</CardTitle>
                <CardDescription>{}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1 p-1">
                {searchedGroups?.map((group) => (
                  <div
                    key={group?._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                  >
                    <Link href={`/chat/${group?._id}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={group?.groupIcon || "/default-avatar.png"}
                          alt={group?.name}
                          className="w-10 h-10 rounded-full object-cover object-top"
                        />
                        <div>
                          <p className="font-medium">{group?.name}</p>
                        </div>
                      </div>
                    </Link>

                    {group.participants?.some(
                      (p) => p._id === currentLoggedInUser._id
                    ) ? (
                      <Button
                        disabled
                        className="bg-gray-200 text-gray-500 cursor-not-allowed"
                      >
                        Joined
                      </Button>
                    ) : (
                      <Button
                        onClick={() => joinGroup(group?._id)}
                        className="cursor-pointer bg-[#ff6500]/20 hover:bg-[#ff6500]/20 text-[#ff6500] hover:text-[#ff6500]"
                      >
                        Join
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Groups;
