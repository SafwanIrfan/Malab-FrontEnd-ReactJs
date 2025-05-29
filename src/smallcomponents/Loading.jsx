import React from "react";
import { FaSpinner } from "react-icons/fa6";

const Loading = () => {
   return (
      <div className="text-5xl flex justify-center h-screen items-center">
         <FaSpinner className="animate-spin" />
      </div>
   );
};

export default Loading;
