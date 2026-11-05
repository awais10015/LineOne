"use server";

import { hash } from "bcryptjs";
import validator from "validator";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { signIn } from "@/auth";
import { normalizeUsername } from "@/lib/formatUsername";

const MIN_AGE_YEARS = 10;
const GENDERS = new Set(["male", "female", "other"]);

function validateDateOfBirth(isoDate: string): string | null {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return "Please select a valid date of birth.";
  }
  const dob = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(dob.getTime())) return "Invalid date of birth.";

  const maxDob = new Date();
  maxDob.setFullYear(maxDob.getFullYear() - MIN_AGE_YEARS);
  maxDob.setHours(0, 0, 0, 0);

  if (dob.getTime() > maxDob.getTime()) {
    return `You must be at least ${MIN_AGE_YEARS} years old.`;
  }
  return null;
}

export async function registerUser(formData: FormData): Promise<string | null> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();
  const username = normalizeUsername(formData.get("username")?.toString() || "");
  const dateOfBirth = formData.get("dateOfBirth")?.toString() || "";
  const gender = formData.get("gender")?.toString() || "";

  if (!name || name.length < 2) return "Please enter your name.";
  if (!email || !validator.isEmail(email)) return "Please enter a valid email.";
  if (!password || password.length < 6)
    return "Password must be at least 6 characters.";
  if (!username || username.length < 2)
    return "Please choose a username (at least 2 characters).";
  if (!GENDERS.has(gender)) return "Please select your gender.";

  const dobError = validateDateOfBirth(dateOfBirth);
  if (dobError) return dobError;

  try {
    await connect();

    if (await User.findOne({ email })) {
      return "An account with this email already exists.";
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) return "That username is already taken.";

    const hashedPassword = await hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      dateOfBirth: new Date(dateOfBirth + "T00:00:00"),
      gender,
    });

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return "Account created but sign-in failed. Try logging in.";
    }

    return null;
  } catch (err) {
    console.error("registerUser:", err);
    return "Something went wrong. Please try again.";
  }
}
