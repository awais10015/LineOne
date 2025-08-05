"use server";

import { signIn } from "@/auth";

const credentialsLogin = async (email: string, password: string) => {
  const res = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (res?.error) return res.error;
  return null;
};

export { credentialsLogin };
