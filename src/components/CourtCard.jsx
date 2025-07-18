import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../contexts/Context";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { getDecodedToken, getToken, getUsername } from "../utils/authToken";

const CourtCard = (court) => {
   const { refreshData } = useContext(AppContext);
   const [refresh, setRefresh] = useState(false);

   const token = getToken();

   const decoded = getDecodedToken();

   const navigate = useNavigate();

   console.log(court);

   useEffect(() => {
      refreshData();
      setRefresh(false);
   }, [refresh]);

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

   return (
      <Link
         key={court.id}
         className=" text-black rounded-lg shadow-2xl border-gray-500 hover:shadow-green-color cursor-pointer transition-all"
         to={`/court/${court.id}`}
      >
         <div className="bg-green-color p-2 rounded-t">
            <h2 className="text-center text-xl font-sans font-black text-white">
               {court.name.toUpperCase()}
            </h2>
         </div>
         <div>
            {court.imageUrls.length > 0 ? (
               <img
                  src={court.imageUrls[0].url}
                  alt="Court Image"
                  className="w-full h-52 object-cover  "
               />
            ) : (
               <div className="w-full h-52 rounded-b-lg font-thin flex justify-center items-center">
                  NO IMAGE
               </div>
            )}
            <div className=""></div>
         </div>

         <div className="px-4 pb-4">
            <div className="flex justify-between my-2">
               <p className="font-bold text-lg">{court.pricePerHour}/hour</p>
               <div>
                  <button
                     onClick={(e) => {
                        e.preventDefault(); // For not navigating
                        handleAddFav(court?.id);
                     }}
                     className={
                        court?.courtsFavorites?.length > 0 && token
                           ? court.courtsFavorites?.id?.usersId ===
                             decoded?.usersid
                              ? "text-red-600 transition-all scale-110"
                              : " transition-all"
                           : ""
                     }
                  >
                     <FaHeart className="text-xl ease-in-out transition-all" />
                  </button>
               </div>
            </div>
            <p className="mb-1">{court.description}</p>
            <p className="text-gray-600 ">{court.location}</p>
            {/* <Link
                                      className=" p-2 bg-green-color text-gray-200 hover:text-white hover:text- transition-all font-semibold rounded"
                                      to={`/court/${court.id}`}
                                   >
                                      Show more details
                                   </Link> */}
         </div>
      </Link>
   );
};

export default CourtCard;
