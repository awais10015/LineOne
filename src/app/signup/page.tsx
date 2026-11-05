import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "@/components/auth/SignupForm";
import GoogleSignInButton from "@/components/client/GoogleSignInButton";

export const metadata = {
  title: "LineOne — Sign up",
  description: "Create your LineOne account",
};

export default async function SignupPage() {
  const session = await auth();
  if (session?.user?.email) {
    await connect();
    const user = await User.findOne({ email: session.user.email }).select(
      "username"
    );
    redirect(user?.username ? "/home" : "/");
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Set up your profile in one step — then follow people to fill your feed."
      badge="Join LineOne"
      wide
      footer={
        <>
          <span className="text-center text-sm text-muted-foreground">Or</span>
          <GoogleSignInButton />
          <Link
            href="/login"
            className="text-sm text-[#ff6500] hover:underline text-center"
          >
            Already have an account? Log in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
