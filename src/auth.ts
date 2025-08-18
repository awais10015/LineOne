import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { User } from "./models/userModel";
import { compare } from "bcryptjs";
import { connect } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password)
          throw new CredentialsSignin("Please provide both Email and Password");

        //connect with DB
        await connect();

        const user = await User.findOne({ email }).select("+password");

        if (!user) throw new CredentialsSignin("Invalid Email or Password");

        if (!user.password)
          throw new CredentialsSignin("Invalid Email or Password");

        const isMatch = await compare(password, user.password);
        if (!isMatch) throw new CredentialsSignin("Password didn't Match");
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      try {
        if (account?.provider === "google") {
          const { email, name, id } = user;
          await connect();
          const alreadyUser = await User.findOne({ email });

          if (!alreadyUser) {
            await User.create({ email, name, googleId: id });
          }
        }
        return true; // ✅ always return true if successful
      } catch (err) {
        console.error("Sign-in error:", err);
        return false;
      }
    },
  },
});
