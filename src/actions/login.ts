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
      if (res.error.includes("CredentialsSignin")) {
        return "Invalid email or password.";
      }
      return res.error;
    }

    return null;
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      const message = err.message?.trim();
      if (message && message !== "CredentialsSignin") {
        return message;
      }
      return "Invalid email or password.";
    }

    console.error("Unexpected error during login:", err);
    return "Something went wrong. Please try again.";
  }
};

export { credentialsLogin };
