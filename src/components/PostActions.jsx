"use client"
import React, { useEffect, useState } from 'react'
import Button from "./ui/button"
const PostActions = ({postId}) => {
    
  return (
   <>
    <div>
        <Button>Like</Button>
        <Button>Dislike</Button>
        <Button>Comment</Button>
    </div>
   </>
  )
}

export default PostActions