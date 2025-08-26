// app/api/posts/user/[id]/route.js
import { connect } from "@/lib/db";
import { Post } from "@/models/postModel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connect();
    const { id } = await params; 
    
    console.log(id)
    const post = await Post.findById(id)
       .populate("taggedUsers")
       .populate("postBy")
       .sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
