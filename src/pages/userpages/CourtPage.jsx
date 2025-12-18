import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
   FaArrowLeft,
   FaArrowRight,
   FaEdit,
   FaHeart,
   FaTrash,
} from "react-icons/fa";
import AppContext from "../../contexts/Context";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../smallcomponents/Loading";
import { CopyCheckIcon, CopyIcon, MapPin } from "lucide-react";
import { getDecodedToken, getToken } from "../../utils/authToken";
import { fetchCourtById } from "../../services/api";

const CourtPage = () => {
   const { id } = useParams();
   const [imageIndex, setImageIndex] = useState(0);
   const { getOneWeek } = useContext(AppContext);

   const token = getToken();

   const decoded = getDecodedToken();

   const [copyState, setCopyState] = useState("Idle");

   const navigate = useNavigate();
   const oneWeek = getOneWeek();

   const queryClient = useQueryClient();

   const addFavMutation = useMutation({
      mutationFn: (courtId) =>
         axios.post(
            `http://localhost:8080/court/${courtId}/user/${decoded.usersId}/fav`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
         ),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["court"] }); // refresh court list with updated fav info
      },
   });

   const handleAddFav = (id) => {
      if (!token) {
         navigate("/auth/login");
         return;
      }
      addFavMutation.mutate(id);
   };

   const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this court?")) {
         try {
            await axios.delete(`http://localhost:8080/court/${id}/delete`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });
            navigate("/user");
            toast.success(`${court.name} successfully deleted.`);
         } catch (error) {
            console.log("Error deleting court : ", error);
            toast.error(`There was a problem occur in deleting ${court.name}`);
         }
      }
   };

   const { data: court, isLoading, error } = fetchCourtById(id, token);
   // useQuery({
   //    queryKey: ["court", id],
   //    queryFn: () =>
   //       axios
   //          .get(`http://localhost:8080/court/${id}`, {
   //             headers: {
   //                Authorization: `Bearer ${token}`,
   //             },
   //          })
   //          .then((res) => res.data),
   //    enabled: !!id, // makes sure query runs only when id is available
   // });

   const copyUrl = async () => {
      try {
         navigator.clipboard.writeText(window.location.href);
         setCopyState("Copied");
         setTimeout(() => setCopyState("Idle"), 2000);
      } catch (error) {
         setCopyState("Error");
         setTimeout(() => setCopyState("Idle"), 2000);
         console.log("Error in copying link : ", error);
      }
   };

   if (isLoading) return <Loading />;

   if (error)
      return (
         <div className="p-4 mt-20 flex justify-center items-center">
            <div className="px-4 py-8 flex flex-col  text-center  rounded text-balance ">
               <h1 className="text-5xl mb-2">OOPS!</h1>
               <p className="mb-4 text-xl">
                  Your session is expired. Please login
               </p>
            </div>
         </div>
      );

   const isFavorited = court && court.courtsFavorites && court.courtsFavorites.length > 0 && 
                       court.courtsFavorites?.some(fav => fav.id?.usersId === decoded?.usersId);

   return (
      <>
         {court && (
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 text-black transition-all max-w-7xl mx-auto">
               {court?.courtImageUrls?.length > 0 && (
                  <section className="relative items-center gap-4 flex justify-center mb-8">
                     <button
                        className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                           imageIndex > 0
                              ? "bg-blackberry-color/80 hover:bg-blackberry-color text-white shadow-lg hover:scale-110"
                              : "invisible"
                        }`}
                        onClick={() => setImageIndex(imageIndex - 1)}
                        aria-label="Previous image"
                     >
                        <FaArrowLeft className="text-lg" />
                     </button>
                     <div className="relative overflow-hidden rounded-2xl shadow-2xl max-w-4xl">
                        <img
                           src={court.courtImageUrls[imageIndex].url}
                           alt={`${court.courtName} - Image ${imageIndex + 1}`}
                           className="h-64 sm:h-80 md:h-96 w-full object-cover"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                           {imageIndex + 1} / {court.courtImageUrls.length}
                        </div>
                     </div>
                     <button
                        className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                           imageIndex < court.courtImageUrls.length - 1
                              ? "bg-blackberry-color/80 hover:bg-blackberry-color text-white shadow-lg hover:scale-110"
                              : "invisible"
                        }`}
                        onClick={() => setImageIndex(imageIndex + 1)}
                        aria-label="Next image"
                     >
                        <FaArrowRight className="text-lg" />
                     </button>
                  </section>
               )}
               <section className="grid grid-cols-3 place-items-center gap-4 w-full my-8">
                  <div className="w-full flex justify-start">
                     <button
                        onClick={() => navigate(`/owner/court/${id}/edit`)}
                        className="text-xl text-white bg-green-color hover:bg-sgreen-color hover:text-black rounded-full p-3 transition-all shadow-md hover:shadow-lg"
                        aria-label="Edit court"
                     >
                        <FaEdit />
                     </button>
                  </div>
                  <div className="text-center">
                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blackberry-color">
                        {court.courtName.toUpperCase()}
                     </h1>
                  </div>
                  <div className="w-full flex justify-end">
                     <button
                        onClick={handleDelete}
                        className="text-xl bg-red-500 hover:bg-red-600 rounded-full p-3 text-white transition-all shadow-md hover:shadow-lg"
                        aria-label="Delete court"
                     >
                        <FaTrash />
                     </button>
                  </div>
               </section>
               <section className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl shadow-xl mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                     <div>
                        <p className="text-3xl sm:text-4xl font-bold text-green-color">
                           Rs {court.pricePerHour}
                           <span className="text-xl font-normal text-gray-600">/hour</span>
                        </p>
                        <div className="text-lg font-semibold text-gray-600 mt-2">
                           Total Bookings: <span className="text-green-color">{court?.totalBookings ?? 0}</span>
                        </div>
                     </div>
                     <div className="flex gap-4 items-center">
                        <button
                           onClick={() => handleAddFav(court.id)}
                           className={`p-3 rounded-full transition-all duration-200 ${
                              isFavorited
                                 ? "text-red-600 bg-red-50"
                                 : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                           }`}
                           aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                           <FaHeart className={`text-3xl ${isFavorited ? "fill-current" : ""} hover:scale-110 duration-200 ease-in-out transition-all`} />
                        </button>
                        <button 
                           onClick={copyUrl}
                           className="p-3 rounded-full text-gray-400 hover:text-green-color hover:bg-green-50 transition-all duration-200"
                           aria-label="Copy link"
                        >
                           {copyState === "Idle" ? (
                              <CopyIcon className="size-8 hover:scale-110 duration-200 ease-in-out transition-all" />
                           ) : (
                              <CopyCheckIcon className="size-8 text-green-color scale-110 ease-in-out" />
                           )}
                        </button>
                     </div>
                  </div>
                  <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                     <MapPin className="text-red-600 mt-1 h-6 w-6 flex-shrink-0" />
                     <p className="text-gray-700 text-lg sm:text-xl">
                        {court?.area}, {court?.city}
                     </p>
                  </div>
               </section>
               <section className="bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl p-6 sm:p-8 shadow-xl">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-blackberry-color">View Available Slots</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 text-center">
                     {oneWeek.map((week, index) => (
                        <Link
                           to={`/user/timings/${court.id}/${week.day}/${week.date}`}
                           key={index}
                           className="bg-gradient-to-br from-green-color to-sgreen-color p-4 text-white hover:from-sgreen-color hover:to-green-color border-2 border-blackberry-color hover:text-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                           <p className="font-bold text-sm sm:text-base">{week.day.toUpperCase()}</p>
                           <p className="text-xs sm:text-sm mt-1">{week.date}</p>
                        </Link>
                     ))}
                  </div>
               </section>
            </div>
         )}
      </>
   );
};

export default CourtPage;
