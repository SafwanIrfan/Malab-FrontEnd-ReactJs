import React from "react";
import { FaSpinner } from "react-icons/fa6";

const Loading = () => {
   return (
      <div className="flex flex-col justify-center items-center h-screen" style={{ background: 'linear-gradient(to bottom right, #eee8f3, white, #eee8f3)' }}>
         <div className="relative">
            <FaSpinner className="text-6xl text-green-color animate-spin" />
            <div className="absolute inset-0 border-4 border-green-color/20 rounded-full animate-ping"></div>
         </div>
         <p className="mt-6 text-xl text-gray-600 font-medium">Loading...</p>
      </div>
   );
};

export default Loading;
