"use server";

import User from "../models/user.model";
import { connect } from "@/lib/db";

interface CreateUserInput {
  name: string;
  email: string;
  clerkId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
  passwordEnabled?: string;
}

export async function createUser(user: CreateUserInput) {
  try {
    await connect();

    const existingUser = await User.findOne({ clerkId: user.clerkId });
    if (existingUser) {
      console.log("⚠️ User already exists:", existingUser.email);
      return existingUser;
    }

    const newUser = await User.create(user);
    console.log("✅ User created:", newUser.email);
    return JSON.parse(JSON.stringify(newUser));
  } catch (err) {
    console.error("❌ Error creating user:", err);
    throw new Error("Failed to create user");
  }
}