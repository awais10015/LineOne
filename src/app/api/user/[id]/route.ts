import { connect } from "@/lib/db";
import { User } from "@/models/userModel";
import { NextRequest } from "next/server";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connect();
    const { id } = await params;
    const user = await User.findById(id).populate("posts");

    return new Response(JSON.stringify(user), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to fetch user" }), {
      status: 500,
    });
  }
}
