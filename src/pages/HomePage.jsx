import { React, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import AppContext from "../contexts/Context";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const HomePage = () => {
   const navigate = useNavigate();
   const { favourite, setFavourite, searchCourtsResults } =
      useContext(AppContext);
   const [refresh, setRefresh] = useState(false);
   const { currentUser } = useAuth();
   const [courts, setCourts] = useState([]);

   const user = JSON.parse(localStorage.getItem("user"));

   const jwtToken = localStorage.getItem("token");

   const decoded = jwtToken && jwtDecode(jwtToken);

   if (jwtToken) {
      navigator.geolocation.getCurrentPosition(
         (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            console.log("User location:", lat, lng); // 24.8152064 67.0728192
            // Send to backend here
         },
         (err) => {
            console.error(err);
         }
      );
   }

   const handleAddFav = async (court) => {
      if (!user) {
         navigate("/auth/login");
      }
      try {
         await axios.post(
            `http://localhost:8080/court/${court.id}/user/${decoded.usersId}/fav`,
            {},
            {
               headers: {
                  Authorization: `Bearer ${jwtToken}`,
               },
            }
         );
         toast.success("FAV DONE!");
         setRefresh(true);
      } catch (error) {
         console.log("Error adding fav : ", error);
      }
   };

   // useEffect(() => {
   //    try {
   //       const addFav = async () => {
   //          await axios.post(
   //             `http://localhost:8080/court/${courtId}/fav`,
   //             favoriteData,
   //             {
   //                headers: {
   //                   "Content-Type": "application/json",
   //                   Authorization: `Bearer ${jwtToken}`,
   //                },
   //             }
   //          );
   //       };
   //       addFav();
   //    } catch (error) {
   //       console.log("Error adding fav : ", error);
   //    }
   // }, []);

   const fetchCourts = async () => {
      try {
         const response = await axios.get("http://localhost:8080/courts", {});
         setCourts(response.data); // Directly use the fetched courts
      } catch (error) {
         console.log("Error fetching courts:", error);
      }
   };

   useEffect(() => {
      fetchCourts();
      console.log(courts);
   }, []);

   useEffect(() => {
      fetchCourts();
      setRefresh(false);
   }, [refresh]);

   const items = searchCourtsResults.length > 0 ? searchCourtsResults : courts;
   console.log(items);

   return (
      <>
         {courts.length >= 0 && (
            <div className="p-10  text-black">
               <h1 className="text-center text-2xl text-green-500 font-black mb-6">
                  {user && `Welcome back ${user}!`}
               </h1>

               <div className="flex justify-between mt-10">
                  <h1 className="text-2xl font-black mb-6">Available Courts</h1>
                  <Link to={"/add_court"}>
                     <button className="p-4 font-semibold text-white bg-green-color hover:bg-sgreen-color hover:text-black transition-all rounded">
                        Add Court
                     </button>
                  </Link>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  my-5 ">
                  {items.map((court) => (
                     <Link
                        key={court.id}
                        className=" text-black rounded-lg  border border-gray-500 hover:shadow-green-color hover:shadow-2xl cursor-pointer transition-all"
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
                              <p className=" font-bold text-lg">
                                 {court.pricePerHour}/hour
                              </p>
                              <div>
                                 <button
                                    onClick={(e) => {
                                       e.preventDefault(); // For not navigating
                                       handleAddFav(court);
                                       setFavourite((prevState) => !prevState);
                                    }}
                                    className={
                                       court.courtsFavorites.length > 0
                                          ? court.courtsFavorites?.id
                                               ?.usersId === decoded?.id
                                             ? "text-red-600 transition-all  "
                                             : " transition-all"
                                          : ""
                                    }
                                 >
                                    <FaHeart className="text-xl hover:scale-110 duration-200 ease-in-out transition-all" />
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
                  ))}
               </div>
            </div>
         )}
      </>
   );
};

export default HomePage;
