"use client";
import Loader from "@/components/Loader";
import PostCard from "@/components/post/PostCard";
import FollowUnfollowButton from "@/components/profile/FollowUnfollowButton";
import MessageButton from "@/components/profile/MessageButton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnotherUserContext from "@/context/AnotherUserContext";
import CurrentUserContext from "@/context/CurrentUserContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState, useCallback } from "react";
import { parseJsonResponse } from "@/lib/parseJsonResponse";

const Profile = () => {
 
  const { id } = useParams();
  const { AnotherUser, setAnotherUser } = useContext(AnotherUserContext);
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  const [posts, setPosts] = useState(null);
  const [loader, setloader] = useState(false);
  const [postloader, setpostloader] = useState(false);
  const router = useRouter();

  let userProfilePic =
    AnotherUser?.profilePic ||
    (AnotherUser?.gender === "male" ? "/Mdp.jpg" : "/Fdp.jpg");
  let userCoverPic = AnotherUser?.coverPic || "/cover.jpg";

  const getUsers = async () => {
    setloader(true);
    try {
      if (id === currentLoggedInUser._id) {
        router.push("/userprofile");
        return;
      }
      const res = await fetch(`/api/user/${id}`);
      const data = await res.json();

      setAnotherUser(data);
      setloader(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setloader(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

 

  useEffect(() => {
    if (!id) return;
    const getPosts = async () => {
      setpostloader(true);
      try {
        const res = await fetch(`/api/posts/user/${id}`);
        const data = await res.json();
        setPosts(data.posts);
        setpostloader(false);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setpostloader(false);
      }
    };

    getPosts();
  }, [id]);

  const refreshCurrentUser = useCallback(async () => {
    const res = await fetch("/api/currentUser");
    const data = await parseJsonResponse(res, { user: null });
    if (data.user) setCurrentLoggedInUser(data.user);
  }, [setCurrentLoggedInUser]);

  const isViewingSelf =
    String(id) === String(currentLoggedInUser?._id);

  return (
    <>
     

      <div className="flex flex-col w-full items-center ">
        <div className="min-h-screen max-w-4xl min-w-full flex flex-col items-center">
    
          {loader ? (
            <Loader />
          ) : (
            <div className="w-full max-w-4xl  rounded-2xl shadow-lg overflow-hidden srollbar-hide">
           
              <div
                style={{ backgroundImage: `url(${userCoverPic})` }}
                className="w-full h-48 relative"
              >
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center text-xl font-bold">
                    <img
                      className="w-32 h-32 rounded-full border-2 border-white bg-gray-300 object-cover object-top"
                      src={userProfilePic}
                      alt="dp"
                    />
                  </div>
                </div>
              </div>

              
              <div className="mt-20  pb-6 text-center">
                <h1 className="text-2xl font-bold ">{AnotherUser?.name}</h1>
                <p className="">{AnotherUser?.username}</p>
                <p className="mt-3">
                  {AnotherUser?.isLimitedProfile
                    ? "This account is private."
                    : AnotherUser?.bio || "no bio added"}
                </p>

                {AnotherUser?.isLimitedProfile ? (
                  <div className="mt-5 flex gap-5 w-full justify-center items-center">
                    <FollowUnfollowButton
                      currentLoggedInUser={currentLoggedInUser}
                      id={AnotherUser?._id}
                      refresh={getUsers}
                    />
                  </div>
                ) : (
                  <>
                <div className="mt-6 w-full h-12 flex justify-center items-center gap-5">
                  <div>
                    <p className="font-bold ">{AnotherUser?.posts?.length}</p>
                    <p className="text-sm px-3"> Posts</p>
                  </div>
                  <Separator orientation="vertical" />


                  <Dialog>
                    <DialogTrigger asChild>
                      <div className=" h-12 flex justify-center items-center gap-5">
                        <div>
                          <p className="font-bold cursor-pointer">
                            {AnotherUser?.followers?.length}
                          </p>
                          <p className=" text-sm">Followers</p>
                        </div>
                        <Separator orientation="vertical" />
                        <div>
                          <p className="font-bold cursor-pointer">
                            {AnotherUser?.following?.length}
                          </p>
                          <p className=" text-sm">Following</p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                      </DialogHeader>
                      <Tabs
                        defaultValue="followers"
                        className="w-full flex items-center justify-center flex-col"
                      >
                        <TabsList>
                          <TabsTrigger value="followers">Followers</TabsTrigger>
                          <TabsTrigger value="following">Following</TabsTrigger>
                        </TabsList>

                        
                        <TabsContent
                          value="followers"
                          className="w-full max-h-[350px] mt-1 space-y-3 overflow-scroll scrollbar-hide"
                        >
                          {AnotherUser?.followers?.map((follower) => (
                            <div
                              key={follower._id}
                              className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                            >
                         
                              <Link href={`/userprofile/${follower._id}`}>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      follower?.profilePic ||
                                      "/default-avatar.png"
                                    }
                                    alt={follower?.name}
                                    className="w-10 h-10 rounded-full object-cover object-top"
                                  />
                          
                                  <div>
                                    <p className="font-medium">
                                      {follower?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {follower?.username}
                                    </p>
                                  </div>
                                </div>
                              </Link>

                          

                              <FollowUnfollowButton
                                currentLoggedInUser={currentLoggedInUser}
                                id={follower?._id}
                                refresh={getUsers}
                              />
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent
                          value="following"
                          className="w-full max-h-[350px] mt-1 space-y-3 overflow-scroll scrollbar-hide"
                        >
                          {AnotherUser?.following?.map((following) => (
                            <div
                              key={following._id}
                              className="flex items-center justify-between p-2 rounded-lg hover:text-black hover:bg-gray-100"
                            >
                              <Link href={`/userprofile/${following._id}`}>
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      following?.profilePic ||
                                      "/default-avatar.png"
                                    }
                                    alt={following?.name}
                                    className="w-10 h-10 rounded-full object-cover object-top"
                                  />
                                  <div>
                                    <p className="font-medium">
                                      {following?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {following?.username}
                                    </p>
                                  </div>
                                </div>
                              </Link>

                              <FollowUnfollowButton
                                currentLoggedInUser={currentLoggedInUser}
                                id={following?._id}
                                refresh={getUsers}
                              />
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>

                      <DialogFooter></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

            
                <div className="mt-5 flex gap-5 w-full justify-center items-center">
                  <FollowUnfollowButton
                    currentLoggedInUser={currentLoggedInUser}
                    id={AnotherUser?._id}
                    
                  />
                  <MessageButton id={AnotherUser?._id} />
                </div>
                  </>
                )}
              </div>
            </div>
          )}

   
          {postloader ? (
            <Loader />
          ) : AnotherUser?.isLimitedProfile ? null : (
            <div className="w-full mt-15 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
              <div className="px-2 pb-3">
                <h2 className="text-xl font-bold">Posts</h2>
              </div>

              {posts?.length > 0 ? (
                <div className="w-full px-2 flex flex-col items-center gap-3 max-w-4xl rounded-2xl overflow-hidden srollbar-hide">
                  {posts?.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      authorOverride={AnotherUser}
                      showAuthorFollow={!isViewingSelf}
                      onFollowChange={refreshCurrentUser}
                    />
                  ))}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="my-8 inline-flex items-center gap-2 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300"
                  >
                    <span>🚀 That’s all for now!</span>
                  </motion.div>
                </div>
              ) : (
                <div className="w-full flex h-[300px] justify-center items-center">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
