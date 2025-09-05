import React from "react";
import { LoaderOne } from "@/components/ui/loader";
import { PulseLoader } from "react-spinners";
const Loader = ({ size = 15, height = "100vh", color = "#ff6500" }) => {
  return (
    <div
      className="w-full flex justify-center items-center"
      style={{ height }}
    >
      <PulseLoader color={color} speedMultiplier={0.5} size={size} />
    </div>
  );
};


export default Loader;
