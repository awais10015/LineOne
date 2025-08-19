"use client";
import React, { useState } from "react";
import {  Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          id="password"
          name="password"
          className="pl-10 pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
    </>
  );
};

export default PasswordInput;
