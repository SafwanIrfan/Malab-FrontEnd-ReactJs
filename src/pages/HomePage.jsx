import { React, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import AppContext from "../contexts/Context";
import { toast } from "react-toastify";
import SearchBar from "../components/SearchBar";
import CourtCard from "../components/CourtCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "../smallcomponents/Loading";
import Button from "../smallcomponents/Button";

const HomePage = () => {
   const { searchCourtsResults, user } = useContext(AppContext);

   const navigate = useNavigate();

   // if (jwtToken) {
   //    navigator.geolocation.getCurrentPosition(
   //       (pos) => {
   //          const lat = pos.coords.latitude;
   //          const lng = pos.coords.longitude;
   //          console.log("User location:", lat, lng); // 24.8152064 67.0728192
   //          // Send to backend here
   //       },
   //       (err) => {
   //          console.error(err);
   //       }
   //    );
   // }

   // const handleAddFav = async (id) => {
   //    if (!user) {
   //       navigate("/auth/login");
   //    }
   //    try {
   //       await axios.post(
   //          `http://localhost:8080/court/${id}/user/${decoded.usersId}/fav`,
   //          {},
   //          {
   //             headers: {
   //                Authorization: `Bearer ${jwtToken}`,
   //             },
   //          }
   //       );
   //       toast.success("FAV DONE!");
   //       setRefresh(true);
   //    } catch (error) {
   //       console.log("Error adding fav : ", error);
   //    }
   // };

   // const fetchCourts = async () => {
   //    try {
   //       const response = await axios.get("http://localhost:8080/courts", {});
   //       setCourts(response.data); // Directly use the fetched courts
   //    } catch (error) {
   //       console.log("Error fetching courts:", error);
   //    }
   // };

   const { data: courts, isLoading } = useQuery({
      queryKey: ["courts"],
      queryFn: () =>
         axios.get("http://localhost:8080/courts", {}).then((res) => res.data),
   });

   if (isLoading) return <Loading />;

   // useEffect(() => {
   //    fetchCourts();
   //    console.log(courts);
   // }, []);

   const items = searchCourtsResults.length > 0 ? searchCourtsResults : courts;

   return (
      <>
         {courts?.length >= 0 && (
            <div className="p-10 text-black">
               <div className="sm:hidden flex justify-center mb-2">
                  <SearchBar />
               </div>
               {user && (
                  <div className="w-[400px] border-[1px] border-black overflow-hidden mx-auto rounded-full hover:bg-black/10 bg-white transition-all shadow-lg">
                     <h1 className="text-center text-2xl py-2 px-10 text-sgreen-color animate-marquee font-black ">
                        {`Welcome back ${user}!`}
                     </h1>
                  </div>
               )}
               <div className="flex justify-between mt-10">
                  <h1 className="text-2xl font-black mb-6">Available Courts</h1>
                  <Button
                     title="Add Court"
                     action={() => navigate("add_court")}
                  />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  my-5 ">
                  {items.map((court) => (
                     <CourtCard key={court.id} {...court} />
                  ))}
               </div>
            </div>
         )}
      </>
   );
};

export default HomePage;
