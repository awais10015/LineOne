"use client"
import React from 'react'
import { Button } from '../ui/button'
import { toast } from "sonner"
import { XCircle } from "lucide-react";


const UnfollowButton = ({id , currentLoggedInUser , refresh}) => {
  const unfollow = async () => {
    console.log("unfollowed");
    const unfollowData = {
      unfollow: id,
      unfollowedBy: currentLoggedInUser,
    }
    await fetch("/api/unfollow" , {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(unfollowData)
    })

    toast.success("Unfollwed User", {
  icon: <XCircle className="text-red-500" />,
});

    refresh()
  };
  return (
    <>
    <Button onClick={unfollow} className='cursor-pointer text-white bg-gray-600 hover:bg-gray-400' >Unfollow</Button>
    </>
  )
}

export default UnfollowButton