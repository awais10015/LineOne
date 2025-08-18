import React from 'react';

const User = () => {
  return (
    <div className="border w-80 h-90 rounded-3xl flex flex-col items-center overflow-hidden srollbar-hide shadow-lg bg-white">
      
      {/* Cover Photo */}
      <div className="w-full h-32 bg-blue-400 flex justify-center items-center text-white font-bold">
        I am cover photo
      </div>

      {/* Profile Picture */}
      <div className="relative w-full">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center font-bold">
            DP
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-14 px-4 text-center text-gray-600">
        HELLO, this is description. Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit, cumque?
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
          Follow Me
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default User;
