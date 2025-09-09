
import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connect();
    const { id } = await params; 
    
    const posts = await Post.find({ postBy: new mongoose.Types.ObjectId(id) })
       .populate("taggedUsers")
       .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
