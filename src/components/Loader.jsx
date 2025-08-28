import React from "react";
import { LoaderOne } from "@/components/ui/loader";
import { PulseLoader } from "react-spinners";
const Loader = ({size = 15 , height = "screen"}) => {
  return (
    <div className={`w-full h-${height} flex justify-center items-center`}>
      <PulseLoader color="#ff6500" speedMultiplier={0.5} size={size} />
    </div>
  );
};

export default Loader;
