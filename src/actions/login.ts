"use server";

import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

const credentialsLogin = async (email: string, password: string) => {
  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return res.error; // This will catch most authjs errors (like "Invalid email")
    }

    return null; // Success
  } catch (err) {
    // Handle thrown errors from your `authorize` function
    if (err instanceof CredentialsSignin) {
      return err.message; // Custom message you threw in `authorize`
    }

    console.error("Unexpected error during login:", err);
    return "Something went wrong. Please try again.";
  }
};

export { credentialsLogin };
