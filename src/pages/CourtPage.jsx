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
import AppContext from "../contexts/Context";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../smallcomponents/Loading";
import { CopyCheck, CopyCheckIcon, CopyIcon, MapPin } from "lucide-react";
import Button from "../smallcomponents/Button";

const CourtPage = () => {
   const { id } = useParams();
   const [imageIndex, setImageIndex] = useState(0);
   const { getOneWeek, user, jwtToken, decoded } = useContext(AppContext);

   const [copyState, setCopyState] = useState("Idle");

   const navigate = useNavigate();
   const oneWeek = getOneWeek();

   const queryClient = useQueryClient();

   const addFavMutation = useMutation({
      mutationFn: (courtId) =>
         axios.post(
            `http://localhost:8080/court/${courtId}/user/${decoded.usersId}/fav`,
            {},
            { headers: { Authorization: `Bearer ${jwtToken}` } }
         ),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["court"] }); // refresh court list with updated fav info
      },
   });

   const handleAddFav = (id) => {
      if (!user) {
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

   const {
      data: court,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["court", id],
      queryFn: () =>
         axios
            .get(`http://localhost:8080/court/${id}`, {
               headers: {
                  Authorization: `Bearer ${jwtToken}`,
               },
            })
            .then((res) => res.data),
      enabled: !!id, // makes sure query runs only when id is available
   });

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
   // if (error)
   //    return (
   //       <div className="p-4 mt-20 flex justify-center items-center">
   //          <div className="px-4 py-8 flex flex-col  text-center  rounded text-balance ">
   //             <h1 className="text-5xl font-serif mb-2">OOPS!</h1>
   //             <p className="mb-4 text-xl">
   //                Your session is expired. Please login
   //             </p>
   //          </div>
   //       </div>
   //    );

   return (
      <>
         {court && (
            <div className="px-8 py-10 text-black transition-all">
               {court.imageUrls.length > 0 ? (
                  <section className=" items-center gap-2  flex justify-center">
                     <button
                        className={
                           imageIndex > 0
                              ? "bg-gray-800 rounded-full w-10 h-10  hover:bg-black text-white-color transition-all"
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
                        className="h-60 w-[693px] md:h-80 rounded object-contain "
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
                        className="text-xl text-white-color bg-green-color hover:bg-sgreen-color hover:text-black rounded-full p-4 transition-all"
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
                        className="text-xl bg-red-500 hover:bg-red-600 rounded-full p-4 text-black transition-all"
                     >
                        <FaTrash />
                     </button>
                  </div>
               </section>
               <section className="p-6 border-2 border-sgreen-color rounded">
                  <div className="flex justify-between">
                     <p className="text-3xl font-bold mb-4">
                        Rs {court.pricePerHour}
                        <span className="font-normal">/hour</span>
                     </p>
                     <div className="flex gap-6 items-start ">
                        <button
                           onClick={() => handleAddFav(court.id)}
                           className={
                              court.courtsFavorites.length > 0
                                 ? court.courtsFavorites?.id?.usersId ===
                                   decoded?.id
                                    ? "text-red-600 transition-all"
                                    : " transition-all"
                                 : ""
                           }
                        >
                           <FaHeart className="text-3xl hover:scale-110 duration-200 ease-in-out transition-all" />
                        </button>
                        <button onClick={copyUrl}>
                           {copyState === "Idle" ? (
                              <CopyIcon className="size-8 hover:scale-110 duration-200 ease-in-out transition-all" />
                           ) : (
                              <CopyCheckIcon className="size-8 transition-all scale-110 ease-in-out" />
                           )}
                        </button>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <MapPin className="text-red-600  mt-1 h-5 w-5" />

                     <p className="text-gray-700 text-xl">{court.location}</p>
                  </div>
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
         )}
      </>
   );
};

export default CourtPage;
