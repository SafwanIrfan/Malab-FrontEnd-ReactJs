import React, { useEffect, useState } from "react";
import { getDecodedToken, getToken } from "../../utils/authToken";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../smallcomponents/Loading";

const OwnerDashboard = () => {
   const [usersCourt, setUsersCourt] = useState([]);
   const [loading, setLoading] = useState(true);
   const token = getToken();

   const decodedToken = getDecodedToken();

   const ownerId = decodedToken?.usersId;

   const navigate = useNavigate();

   const {
      data: ownerCourt,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["court", ownerId],
      queryFn: async () =>
         await axios
            .get(`http://localhost:8080/owner/${ownerId}/court`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((res) => res.data),
      enabled: !!ownerId,
   });

   const {
      data: ownerBookings,
      isBookingLoading,
      errorBooking,
   } = useQuery({
      queryKey: ["booking", ownerId],
      queryFn: async () =>
         await axios
            .get(`http://localhost:8080/owner/court/${court}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((res) => res.data),
      enabled: !!ownerId,
   });

   const fetchCourtByOwnerId = async () => {
      console.log("BAS KR");
      try {
         const response = await axios.get(
            `http://localhost:8080/owner/${ownerId}/court`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         setUsersCourt(response.data);
      } catch (error) {
         console.log("Court not found : ", error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchCourtByOwnerId();
   }, []);

   // const {
   //    data: usersCourt,
   //    error,
   //    isLoading,
   // } = useQuery({
   //    queryKey: ["court", ownerId],
   //    queryFn: fetchCourtByOwnerId,
   //    enabled: !!ownerId, // ✅ only runs if ownerId is truthy (not null/undefined/0/empty)
   //    refetchOnWindowFocus: false,
   // });

   if (loading) {
      return <Loading />;
   }

   if (error) {
      return <p className="text-center mt-20">Error</p>;
   }

   return ownerCourt.length > 0 ? (
      <div className="flex-1 justify-center items-center px-8">
         {usersCourt.map((court) => (
            <div key={court.id} className="">
               {court.courtStatus == "NOT_APPROVED" ? (
                  <div className="flex flex-col min-h-screen justify-center items-center text-center text-balance">
                     <h1 className="text-4xl font-serif mb-2">
                        Your Court has been sent for approval.
                     </h1>
                     <p className="text-xl">
                        It will take 2-3 days. Thanks for your patience
                     </p>
                  </div>
               ) : (
                  <div>{court?.courtName}</div>
               )}
            </div>
         ))}
      </div>
   ) : (
      <div className="flex flex-col mt-20 items-center font-serif px-8 text-balance">
         <p className="text-4xl sm:text-6xl text-center">Court not found</p>
         <p className="text-xl sm:text-2xl text-gray-800 text-center mt-2">
            Add your court to make it live!
         </p>
         <button
            className="bg-white w-36 text-xl hover:bg-white-color/80 rounded border-[1px] mt-4 border-blackberry-color p-2 transition-all"
            onClick={() => navigate("/owner/add_court")}
         >
            Add Court
         </button>
      </div>
   );
};

export default OwnerDashboard;
