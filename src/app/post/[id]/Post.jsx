"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const Post = () => {
    const {id} = useParams;
  return (
    <div>PostId is : {id}</div>
  )
}

export default Post