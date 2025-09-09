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
      return res.error;
    }

    return null;
  } catch (err) {
    if (err instanceof CredentialsSignin) {
      return err.message;
    }

    console.error("Unexpected error during login:", err);
    return "Something went wrong. Please try again.";
  }
};

export { credentialsLogin };
