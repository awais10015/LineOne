"use client";

import { useState, useContext } from "react";
import { useRouter } from "nextjs-toploader/app";
import { useTopLoader } from "nextjs-toploader";
import { toast } from "sonner";
import { Mail, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/client/PasswordInput";
import DateOfBirthPicker from "@/components/onboarding/DateOfBirthPicker";
import GenderSelect from "@/components/onboarding/GenderSelect";
import { registerUser } from "@/actions/signup";
import CurrentUserContext from "@/context/CurrentUserContext";
import { parseJsonResponse } from "@/lib/parseJsonResponse";
import {
  formatDisplayUsername,
  normalizeUsername,
} from "@/lib/formatUsername";

export default function SignupForm() {
  const router = useRouter();
  const topLoader = useTopLoader();
  const { setCurrentLoggedInUser } = useContext(CurrentUserContext);
  const [usernameInput, setUsernameInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        topLoader.start();
        const formData = new FormData(e.currentTarget);
        formData.set("username", normalizeUsername(usernameInput));

        const error = await registerUser(formData);
        if (error) {
          toast.error(error);
          setSubmitting(false);
          topLoader.done();
          return;
        }

        toast.success("Welcome to LineOne!");
        const userRes = await fetch("/api/currentUser");
        const userData = await parseJsonResponse(userRes, { user: null });
        if (userData.user) setCurrentLoggedInUser(userData.user);
        router.push("/home");
        router.refresh();
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            className="pl-9"
            autoComplete="name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="pl-9"
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          placeholder="johndoe"
          required
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          autoComplete="username"
        />
        <p className="text-xs text-muted-foreground">
          You&apos;ll appear as{" "}
          <span className="font-medium text-foreground">
            {formatDisplayUsername(usernameInput) || "@username"}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <PasswordInput />
      </div>

      <div className="space-y-2">
        <Label>Date of birth</Label>
        <DateOfBirthPicker name="dateOfBirth" required minAgeYears={10} />
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <GenderSelect name="gender" required />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full bg-[#ff6500] hover:bg-[#ff5f00] text-white"
      >
        {submitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
