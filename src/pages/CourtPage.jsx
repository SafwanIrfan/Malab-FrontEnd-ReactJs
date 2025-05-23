import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
   FaArrowLeft,
   FaArrowRight,
   FaEdit,
   FaHeart,
   FaSpinner,
   FaTrash,
} from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";
import AppContext from "../contexts/Context";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

const CourtPage = () => {
   const { id } = useParams();
   const [court, setCourt] = useState(null);
   const [imageIndex, setImageIndex] = useState(0);
   const { getOneWeek, user, jwtToken, decoded, fetchCourts } =
      useContext(AppContext);
   const [refresh, setRefresh] = useState(false);

   const navigate = useNavigate();
   const oneWeek = getOneWeek(court);

   const fetchCourt = async () => {
      try {
         const response = await axios.get(`http://localhost:8080/court/${id}`, {
            headers: { Authorization: `Bearer ${jwtToken}` },
         });
         const courtData = response.data;
         console.log(courtData);
         setCourt(courtData);
      } catch (error) {
         console.log("Fetching error : ", error);
      }
   };
   useEffect(() => {
      fetchCourt();
      console.log(court);
   }, [id]);

   useEffect(() => {
      fetchCourt();
      setRefresh(false);
   }, [refresh]);

   const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this court?")) {
         try {
            await axios.delete(`http://localhost:8080/court/${id}/delete`, {
               headers: {
                  Authorization: `Bearer ${jwtToken}`,
               },
            });
            navigate("/");
            toast.success(`${court.name} successfully deleted.`);
         } catch (error) {
            console.log("Error deleting court : ", error);
            toast.error(`There was a problem occur in deleting ${court.name}`);
         }
      }
   };

   const handleAddFav = async (id) => {
      if (!user) {
         navigate("/auth/login");
      }
      try {
         await axios.post(
            `http://localhost:8080/court/${id}/user/${decoded.usersId}/fav`,
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

   if (!court) {
      return (
         <div className="h-96 flex justify-center items-center ">
            <h2 className="text-black font-bold text-6xl">
               <FaSpinner className="text-white-color animate-spin" />
            </h2>
         </div>
      );
   }

   return (
      <div className="px-8 py-10 text-black transition-all">
         {court.imageUrls.length > 0 ? (
            <section className="items-center gap-2  flex justify-center">
               <button
                  className={
                     imageIndex > 0
                        ? "bg-gray-800 rounded-full w-10 h-10 hover:bg-black text-white-color transition-all"
                        : "invisible"
                  }
                  onClick={() => {
                     setImageIndex(imageIndex - 1);
                     console.log("img index : ", imageIndex);
                  }}
               >
                  <FaArrowLeft className="mx-3" />
               </button>
               <img
                  src={court.imageUrls[imageIndex].url}
                  alt="Court Image"
                  className="h-60 w-[693px] md:h-80 rounded "
               />
               <button
                  className={
                     imageIndex < court.imageUrls.length - 1
                        ? "bg-gray-800 rounded-full w-10 h-10 hover:bg-black text-white-color transition-all "
                        : "invisible"
                  }
                  onClick={() => {
                     setImageIndex(imageIndex + 1);
                     console.log("img index : ", imageIndex);
                  }}
               >
                  <FaArrowRight className="mx-3" />
               </button>
            </section>
         ) : (
            <img
               src={court.imageUrls[0]}
               alt="Court Image"
               className="w-full h-60 rounded "
            />
         )}
         <section className="grid grid-cols-3 place-items-center gap-4 w-full my-10">
            <div className="w-full">
               <button
                  onClick={() => navigate(`/court/${id}/edit`)}
                  className="text-xl text-white-color bg-green-color hover:bg-sgreen-color hover:text-black rounded-full p-4"
               >
                  <FaEdit />
               </button>
            </div>
            <div>
               <p className=" text-4xl font-sans font-black">
                  {court.name.toUpperCase()}
               </p>
            </div>
            <div className="w-full text-right">
               <button
                  onClick={handleDelete}
                  className="text-xl bg-red-500 hover:bg-red-600 rounded-full p-4 text-black"
               >
                  <FaTrash />
               </button>
            </div>
         </section>
         <section className="p-6 border-2 border-sgreen-color rounded  mt-4">
            <div className="flex justify-between">
               <p className="text-3xl font-bold mb-4">
                  Rs {court.pricePerHour}
                  <span className="font-normal">/hour</span>
               </p>

               <button
                  onClick={() => handleAddFav(court.id)}
                  className={
                     court.courtsFavorites.length > 0
                        ? court.courtsFavorites?.id?.usersId === decoded?.id
                           ? "text-red-600 transition-all"
                           : " transition-all"
                        : ""
                  }
               >
                  <FaHeart style={{ width: "1.6rem", height: "1.6rem" }} />
               </button>
            </div>
            <div className="flex gap-2">
               <FaLocationPin className="text-red-600 mt-1 h-5 w-5" />

               <p className="text-gray-700 text-xl">{court.location}</p>
            </div>
            <div></div>
         </section>
         <section>
            <h3 className="text-3xl font-bold my-6">View Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7   gap-4 text-center">
               {oneWeek.map((week, index) => (
                  <Link
                     to={`/timings/${court.id}/${week.day}/${week.date}`}
                     key={index}
                     className=" bg-green-color p-4 text-white-color hover:bg-sgreen-color hover:text-black  rounded shadow-xl transition-all"
                  >
                     <p>{week.day.toUpperCase()}</p>
                     <p>{week.date}</p>
                  </Link>
               ))}
            </div>
         </section>
      </div>
   );
};

export default CourtPage;
