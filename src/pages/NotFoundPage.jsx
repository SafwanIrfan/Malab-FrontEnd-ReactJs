import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

const NotFoundPage = () => {
   return (
      <div className="flex flex-col justify-center items-center min-h-screen">
         <ExclamationTriangleIcon className="size-28 sm:size-36 text-red-600" />
         <h1 className="text-4xl sm:text-5xl mt-2 font-serif text-center text-balance">
            Page Not Found
         </h1>
      </div>
   );
};

export default NotFoundPage;
