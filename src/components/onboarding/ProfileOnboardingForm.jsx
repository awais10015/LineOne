"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTopLoader } from "nextjs-toploader";
import {
  CheckCircle2,
  Lock,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Loader from "@/components/Loader";
import CurrentUserContext from "@/context/CurrentUserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PasswordInput from "@/components/client/PasswordInput";
import DateOfBirthPicker from "@/components/onboarding/DateOfBirthPicker";
import GenderSelect from "@/components/onboarding/GenderSelect";
import {
  formatDisplayUsername,
  normalizeUsername,
} from "@/lib/formatUsername";

function formatUsernamePreview(value) {
  return formatDisplayUsername(value) || "@username";
}

export default function ProfileOnboardingForm() {
  const loader = useTopLoader();
  const router = useRouter();
  const { currentLoggedInUser } = useContext(CurrentUserContext);
  const [bootLoading, setBootLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    if (currentLoggedInUser === null) return;
    if (currentLoggedInUser?.username) {
      router.push("/home");
      return;
    }
    setBootLoading(false);
  }, [currentLoggedInUser, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    loader.start();

    const formData = new FormData(e.currentTarget);
    let username = normalizeUsername(
      formData.get("username")?.toString() || ""
    );
    const dateOfBirth = formData.get("dateOfBirth")?.toString() || "";
    const gender = formData.get("gender")?.toString() || "";
    const planePassword = formData.get("password")?.toString() || "";

    const payload = { username };
    if (dateOfBirth) payload.dateOfBirth = dateOfBirth;
    if (gender) payload.gender = gender;
    if (planePassword) payload.planePassword = planePassword;

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to update profile");

      toast.success("Profile saved — welcome to LineOne!");
      router.push("/home");
    } catch (err) {
      console.error(err);
      toast.error("Could not save profile. Please try again.");
      setSubmitting(false);
      loader.done();
    }
  };

  if (bootLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader />
      </div>
    );
  }

  const firstName = currentLoggedInUser?.name?.split(" ")[0] || "there";
  const needsPassword = !currentLoggedInUser?.password;
  const needsDateOfBirth = !currentLoggedInUser?.dateOfBirth;
  const needsGender = !currentLoggedInUser?.gender;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[#ff6500]/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#ff6500]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center gap-10 px-4 py-10 lg:flex-row lg:gap-16 lg:px-8">
        <motion.section
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg space-y-6 text-center lg:text-left"
        >
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <Image src="/logo.svg" alt="LineOne" width={48} height={48} />
            <span className="text-2xl font-semibold tracking-tight">LineOne</span>
          </div>

          <div className="space-y-3">
            <Badge
              variant="secondary"
              className="bg-[#ff6500]/15 text-[#ff6500] border-[#ff6500]/30"
            >
              Step 1 · Complete your profile
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Hi {firstName}, one more step
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Choose a username so people can find you, then follow creators to
              fill your feed.
            </p>
          </div>

          <ul className="hidden space-y-3 text-sm text-muted-foreground lg:block">
            <li className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6500]" />
              Personalized home with Following and Discover feeds
            </li>
            <li className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6500]" />
              Suggested people to follow when you&apos;re new
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6500]" />
              Stories, chat, and notifications — all in one place
            </li>
          </ul>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="w-full max-w-md"
        >
          <Card className="border-border/80 bg-card/90 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl">Your details</CardTitle>
              <CardDescription>
                This info helps us personalize your experience.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      placeholder="johndoe"
                      required
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="pl-9"
                      autoComplete="username"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll appear as{" "}
                    <span className="font-medium text-foreground">
                      {formatUsernamePreview(usernameInput)}
                    </span>
                  </p>
                </div>

                {needsPassword && (
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Lock className="h-4 w-4 text-[#ff6500]" />
                      Set a password
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optional for Google sign-in — add one to log in with email
                      later.
                    </p>
                    <PasswordInput />
                  </div>
                )}

                {needsDateOfBirth && (
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of birth</Label>
                    <DateOfBirthPicker
                      name="dateOfBirth"
                      required
                      minAgeYears={10}
                    />
                  </div>
                )}

                {needsGender && (
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <GenderSelect name="gender" required />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full bg-[#ff6500] hover:bg-[#ff5f00] text-white"
                >
                  {submitting ? "Saving…" : "Continue to LineOne"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
