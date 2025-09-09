import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { SquarePlus } from "lucide-react";

const CreatePost = () => {
  return (
    <>
      <Link href={"/createpost"} className="cursor-text">
        <Button className="px-6 py-2 text-white dark:text-black cursor-pointer hover:shadow-2xl hover:scale-105">
          {" "}
          <SquarePlus /> Create Post
        </Button>
      </Link>
    </>
  );
};

export default CreatePost;
