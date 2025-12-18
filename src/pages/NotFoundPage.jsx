import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
import { getDecodedToken } from "../utils/authToken";

const NotFoundPage = () => {

   const decodedToken = getDecodedToken();

   return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
         <div className="text-center max-w-2xl">
            <div className="mb-6">
               <div className="bg-red-50 rounded-full p-6 inline-block">
                  <ExclamationTriangleIcon className="size-24 sm:size-32 text-red-600" />
               </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl mt-4 font-black text-center text-balance text-blackberry-color mb-4">
               404 - Page Not Found
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
               The page you're looking for doesn't exist or has been moved.
            </p>
            <a
               href={decodedToken?.role === "ROLE_USER" ? "/user" : decodedToken?.role === "ROLE_OWNER" ? "/owner/dashboard" : "/admin/dashboard"}
               className="inline-block bg-green-color text-white hover:bg-sgreen-color hover:text-black px-8 py-3 rounded-xl border-2 border-blackberry-color transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
            >
               Go to Home
            </a>
         </div>
      </div>
   );
};

export default NotFoundPage;
