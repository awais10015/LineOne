import React, { Suspense } from "react";
import Home from "./Home";
import Loader from "@/components/Loader";

export const metadata = {
  title: "LineOne-Home",
  description: "Home",
};

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Home />
    </Suspense>
  );
};

export default page;