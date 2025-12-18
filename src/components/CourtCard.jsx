import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../contexts/Context";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { getDecodedToken, getToken, getUsername } from "../utils/authToken";

const CourtCard = (court) => {
   const token = getToken();

   const decoded = getDecodedToken();

   const navigate = useNavigate();

   console.log(court);

   const queryClient = useQueryClient();

   const addFavMutation = useMutation({
      mutationFn: (courtId) => {
         console.log("Mutating with courtId:", courtId);
         return axios.post(
            `http://localhost:8080/court/${courtId}/user/${decoded?.usersId}/fav`,
            {},
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["courts"] });
      },
      onError: (error) => {
         console.error(
            "Mutation error:",
            error.response || error.message || error
         );
      },
   });

   const handleAddFav = (id) => {
      if (!token) {
         navigate("/auth/login");
         return;
      }
      addFavMutation.mutate(id);
   };

   const isFavorited = court?.courtsFavorites?.length > 0 && token && 
                       court.courtsFavorites?.some(fav => fav.id?.usersId === decoded?.usersId);

   return (
      <Link
         key={court.id}
         className="group block text-black rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-green-color/50 cursor-pointer transition-all duration-300 overflow-hidden bg-white transform hover:-translate-y-2"
         to={`/user/court/${court.id}`}
      >
         <div className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-green-color to-sgreen-color p-3">
               <h2 className="text-center text-lg sm:text-xl font-sans font-black text-white truncate">
                  {court.courtName.toUpperCase()}
               </h2>
            </div>
            <div className="relative">
               {court?.courtImageUrls?.length > 0 ? (
                  <div className="relative overflow-hidden">
                     <img
                        src={court?.courtImageUrls[0]?.url}
                        alt={`${court.courtName} - Court Image`}
                        className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
               ) : (
                  <div className="w-full h-56 sm:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col justify-center items-center">
                     <div className="text-gray-400 text-sm font-medium">No Image Available</div>
                  </div>
               )}
            </div>
         </div>

         <div className="px-4 sm:px-5 pb-5 pt-4">
            <div className="flex justify-between items-center mb-3">
               <div>
                  <p className="font-bold text-xl sm:text-2xl text-green-color">
                     Rs {court.pricePerHour}
                  </p>
                  <p className="text-sm text-gray-500">per hour</p>
               </div>
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     handleAddFav(court?.id);
                  }}
                  className={`p-2 rounded-full transition-all duration-200 ${
                     isFavorited
                        ? "text-red-600 bg-red-50 scale-110"
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  }`}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
               >
                  <FaHeart className={`text-xl transition-all ${isFavorited ? "fill-current" : ""}`} />
               </button>
            </div>
            <p className="text-gray-700 mb-2 line-clamp-2 text-sm sm:text-base">
               {court.description || "No description available"}
            </p>
            <div className="flex items-center gap-1 text-gray-600 text-sm">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <p className="truncate">{court.area}, {court.city}</p>
            </div>
         </div>
      </Link>
   );
};

export default CourtCard;
