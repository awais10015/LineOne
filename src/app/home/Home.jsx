"use client";

import React, { useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CurrentUserContext from "@/context/CurrentUserContext";
import StoryBar from "@/components/home/StoryBar";
import FollowOnboardingPanel from "@/components/home/FollowOnboardingPanel";
import DiscoverFeed from "@/components/home/DiscoverFeed";
import FeedPostList from "@/components/home/FeedPostList";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Home = () => {
  const { currentLoggedInUser, setCurrentLoggedInUser } =
    useContext(CurrentUserContext);
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome") === "1";

  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const onboardingCompleteRef = useRef(false);

  const followingCount = currentLoggedInUser?.following?.length ?? 0;
  const needsFollowOnboarding =
    !!currentLoggedInUser &&
    !onboardingDismissed &&
    !currentLoggedInUser.followOnboardingCompleted;

  const [activeTab, setActiveTab] = useState("following");
  const [followingPosts, setFollowingPosts] = useState([]);
  const [discoverPosts, setDiscoverPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [loadingDiscover, setLoadingDiscover] = useState(false);
  const [followingCursor, setFollowingCursor] = useState(null);
  const [discoverCursor, setDiscoverCursor] = useState(null);
  const [followingHasMore, setFollowingHasMore] = useState(false);
  const [discoverHasMore, setDiscoverHasMore] = useState(false);
  const [discoverLoaded, setDiscoverLoaded] = useState(false);

  useEffect(() => {
    if (currentLoggedInUser?.followOnboardingCompleted) {
      onboardingCompleteRef.current = true;
      setOnboardingDismissed(true);
    }
  }, [currentLoggedInUser?.followOnboardingCompleted]);

  useEffect(() => {
    if (welcome) {
      setActiveTab("following");
    }
  }, [welcome]);

  const mergeUserIntoContext = useCallback(
    (apiUser, { forceOnboardingComplete = false } = {}) => {
      if (!apiUser) return;
      setCurrentLoggedInUser((prev) => {
        const completed =
          forceOnboardingComplete ||
          onboardingCompleteRef.current ||
          Boolean(prev?.followOnboardingCompleted) ||
          Boolean(apiUser.followOnboardingCompleted);
        if (completed) {
          onboardingCompleteRef.current = true;
        }
        return {
          ...(prev || {}),
          ...apiUser,
          followOnboardingCompleted: completed,
        };
      });
    },
    [setCurrentLoggedInUser]
  );

  const loadSuggested = useCallback(async () => {
    const res = await fetch("/api/feed?mode=suggestedUsers");
    const data = await parseJsonResponse(res, { users: [] });
    setSuggestedUsers(data.users ?? []);
  }, []);

  const loadFollowing = useCallback(async (cursor, append = false) => {
    setLoadingFollowing(true);
    try {
      const qs = new URLSearchParams({ mode: "following", limit: "5" });
      if (cursor) qs.set("cursor", cursor);
      const res = await fetch(`/api/feed?${qs}`);
      const data = await parseJsonResponse(res, {
        posts: [],
        nextCursor: null,
        hasMore: false,
      });
      setFollowingPosts((prev) =>
        append ? [...prev, ...(data.posts ?? [])] : data.posts ?? []
      );
      setFollowingCursor(data.nextCursor ?? null);
      setFollowingHasMore(!!data.hasMore);
    } catch (err) {
      console.error("Failed to fetch following feed:", err);
    } finally {
      setLoadingFollowing(false);
    }
  }, []);

  const loadDiscover = useCallback(async (cursor, append = false) => {
    setLoadingDiscover(true);
    try {
      const qs = new URLSearchParams({ mode: "discover", limit: "5" });
      if (cursor) qs.set("cursor", cursor);
      const res = await fetch(`/api/feed?${qs}`);
      const data = await parseJsonResponse(res, {
        posts: [],
        nextCursor: null,
        hasMore: false,
      });
      setDiscoverPosts((prev) =>
        append ? [...prev, ...(data.posts ?? [])] : data.posts ?? []
      );
      setDiscoverCursor(data.nextCursor ?? null);
      setDiscoverHasMore(!!data.hasMore);
      setDiscoverLoaded(true);
    } catch (err) {
      console.error("Failed to fetch discover feed:", err);
    } finally {
      setLoadingDiscover(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const userRes = await fetch("/api/currentUser");
    const userData = await parseJsonResponse(userRes, { user: null });
    mergeUserIntoContext(userData.user);
    return userData.user;
  }, [mergeUserIntoContext]);

  const refreshDuringOnboarding = useCallback(async () => {
    await loadSuggested();
    const userRes = await fetch("/api/currentUser");
    const userData = await parseJsonResponse(userRes, { user: null });
    mergeUserIntoContext(userData.user);
  }, [loadSuggested, mergeUserIntoContext]);

  const refreshFeeds = useCallback(async () => {
    await Promise.all([loadFollowing(null, false), loadSuggested()]);
    if (discoverLoaded || activeTab === "discover") {
      await loadDiscover(null, false);
    }
    await refreshUser();
  }, [
    loadFollowing,
    loadDiscover,
    loadSuggested,
    refreshUser,
    discoverLoaded,
    activeTab,
  ]);

  const handleOnboardingComplete = useCallback(async () => {
    onboardingCompleteRef.current = true;
    setOnboardingDismissed(true);
    setCurrentLoggedInUser((prev) =>
      prev ? { ...prev, followOnboardingCompleted: true } : prev
    );
    setActiveTab("following");
    await Promise.all([
      loadFollowing(null, false),
      loadDiscover(null, false),
    ]);
    const userRes = await fetch("/api/currentUser");
    const userData = await parseJsonResponse(userRes, { user: null });
    mergeUserIntoContext(userData.user, { forceOnboardingComplete: true });
  }, [loadFollowing, loadDiscover, mergeUserIntoContext, setCurrentLoggedInUser]);

  useEffect(() => {
    if (!currentLoggedInUser?._id) return;
    loadSuggested();
    if (needsFollowOnboarding) {
      return;
    }
    loadFollowing(null, false);
  }, [
    currentLoggedInUser?._id,
    needsFollowOnboarding,
    loadFollowing,
    loadSuggested,
  ]);

  useEffect(() => {
    if (!currentLoggedInUser?._id || needsFollowOnboarding) return;
    if (activeTab === "discover" && !discoverLoaded && !loadingDiscover) {
      loadDiscover(null, false);
    }
  }, [
    activeTab,
    currentLoggedInUser?._id,
    needsFollowOnboarding,
    discoverLoaded,
    loadingDiscover,
    loadDiscover,
  ]);

  const followingEmptyState = (
    <p className="text-muted-foreground py-12 text-center w-full px-2">
      No posts yet from people you follow.{" "}
      <button
        type="button"
        className="text-[#ff6500] hover:underline"
        onClick={() => setActiveTab("discover")}
      >
        Browse Discover
      </button>{" "}
      or{" "}
      <Link href="/users" className="text-[#ff6500] hover:underline">
        find people to follow
      </Link>
      .
    </p>
  );

  if (needsFollowOnboarding) {
    return (
      <div className="w-full flex flex-col items-center justify-start min-h-[60vh] px-2 pt-8 pb-12">
        <div className="w-full max-w-4xl mb-6 text-center sm:text-left">
          <h1 className="text-2xl font-bold tracking-tight">Almost there</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Follow a few people to personalize your home feed.
          </p>
        </div>
        <FollowOnboardingPanel
          followingCount={followingCount}
          suggestedUsers={suggestedUsers}
          currentLoggedInUser={currentLoggedInUser}
          onFollowChange={refreshDuringOnboarding}
          onComplete={handleOnboardingComplete}
          setCurrentLoggedInUser={setCurrentLoggedInUser}
        />
      </div>
    );
  }

  return (
    <>
      <StoryBar />
      <div className="w-full flex items-center justify-center">
        <div className="w-full mt-3 max-w-4xl rounded-2xl overflow-hidden srollbar-hide px-2">
          <div className="mb-4 px-1">
            <h1 className="text-2xl font-bold tracking-tight">Home</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Posts from people you follow — or explore Discover for everyone.
            </p>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full sm:w-auto grid grid-cols-2 sm:inline-flex h-auto p-1 bg-muted/50 rounded-full">
              <TabsTrigger
                value="following"
                className="rounded-full data-[state=active]:bg-[#ff6500] data-[state=active]:text-white"
              >
                Following
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="rounded-full data-[state=active]:bg-[#ff6500] data-[state=active]:text-white"
              >
                Discover
              </TabsTrigger>
            </TabsList>

            <TabsContent value="following" className="mt-0">
              <FeedPostList
                posts={followingPosts}
                loading={loadingFollowing}
                hasMore={followingHasMore}
                cursor={followingCursor}
                onLoadMore={loadFollowing}
                emptyState={followingEmptyState}
              />
            </TabsContent>

            <TabsContent value="discover" className="mt-0">
              <DiscoverFeed
                posts={discoverPosts}
                loading={loadingDiscover}
                hasMore={discoverHasMore}
                cursor={discoverCursor}
                onLoadMore={loadDiscover}
                onGoToFollowing={() => setActiveTab("following")}
                suggestedUsers={suggestedUsers}
                onFollowChange={refreshUser}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Home;
