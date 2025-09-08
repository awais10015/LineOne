"use client";
import MessageButton from "@/components/profile/MessageButton";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CurrentUserContext from "@/context/CurrentUserContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const SearchUser = () => {
  const { currentLoggedInUser } = useContext(CurrentUserContext);

  const [users, setUsers] = useState([]);

  const [searchWord, setSearchWord] = useState(null);

  const [searchedUsers, setSearchedUsers] = useState([]);


  const [loader, setloader] = useState(false);

  

  const fetchUsers = async () => {
    setloader(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      const filteredData = data.users.filter(
        (user) => user._id !== currentLoggedInUser._id
      );
      setUsers(filteredData);
      setloader(false);
    } catch (error) {
      console.log(error);
      setloader(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const wordToSearch = () => {
    if (!searchWord) {
      setSearchedUsers([...users]);
      return;
    }

    const matchedUsers = users.filter((user) =>
      user?.name?.toLowerCase().includes(searchWord.toLowerCase())
    );

    setSearchedUsers(matchedUsers);
  };

  useEffect(() => {
    wordToSearch();
  }, [searchWord, users]);

  return (
    <>
      <div className="w-full flex items-start justify-center mt-5">
        <div className="w-full max-w-4xl px-3 pb-5 flex items-center justify-center flex-col gap-10 rounded-2xl overflow-hidden srollbar-hide">
          {/* <Input type="text" placeholder="Search..." onChange={(e) => setSearchWord(e.target.value)} /> */}
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
                <CardTitle>Users</CardTitle>
                <CardDescription>{}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-1 p-1">
                {searchedUsers?.map((user) => (
                  <div
                    key={user?._id}
                    className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                  >
                    {/* Left: Profile picture */}
                    <Link href={`/userprofile/${user?._id}`}>
                      <div className="flex items-center gap-3">
                        <img
                          src={user?.profilePic || "/default-avatar.png"}
                          alt={user?.name}
                          className="w-10 h-10 rounded-full object-cover object-top"
                        />
                        {/* Middle: Name + Username */}
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {user?.username}
                          </p>
                        </div>
                      </div>
                    </Link>

                    <MessageButton id={user?._id} />
                  </div>
                ))}
              </CardContent>
              {/* <CardFooter>This is the posts footer</CardFooter> */}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchUser;
