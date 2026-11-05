import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/client/Form";
import GoogleSignInButton from "@/components/client/GoogleSignInButton";

export const metadata = {
  title: "LineOne — Log in",
  description: "Log in to LineOne",
};

export default async function LoginPage() {
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
      title="Welcome back"
      subtitle="Log in to see your feed and messages."
      badge="Welcome back"
      footer={
        <>
          <span className="text-center text-sm text-muted-foreground">Or</span>
          <GoogleSignInButton />
          <Link
            href="/signup"
            className="text-sm text-[#ff6500] hover:underline text-center"
          >
            Don&apos;t have an account? Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
