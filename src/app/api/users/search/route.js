import { connect } from "@/lib/db";
import { User } from "@/models/userModel";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  await connect();
  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { username: { $regex: q, $options: "i" } },
      // { gender: { $regex: q, $options: "i" } },
      // { profilePic: { $regex: q, $options: "i" } },
    ],
  }).select("_id name username gender profilePic");

  return new Response(JSON.stringify({ users }), { status: 200 });
}
