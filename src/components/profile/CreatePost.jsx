import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {SquarePlus} from "lucide-react"

const CreatePost = () => {
  return (
    <>
      {/* create post */}
      <Link href={"/createpost"} className="cursor-text">
        {/* <div className=" bg-[#ff4700] text-white rounded-lg  transition ">
            Post
          </div> */}

        <Button className="px-6 py-2 cursor-pointer hover:shadow-2xl hover:scale-105"> <SquarePlus/> Create Post</Button>
      </Link>
      {/* create post end */}
    </>
  );
};

export default CreatePost;
