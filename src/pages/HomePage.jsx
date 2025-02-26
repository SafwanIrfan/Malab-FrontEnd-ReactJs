import { React, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHeart, FaSpinner } from "react-icons/fa";
import AppContext from "../contexts/Context";
import test from "../assets/test.jpg";

const HomePage = () => {
   const [courts, setCourts] = useState(undefined);
   const { favourite, setFavourite } = useContext(AppContext);
   const [countFav, setCountFav] = useState(0);

   useEffect(() => {
      const fetchCourts = async () => {
         try {
            const response = await axios.get("http://localhost:8080/courts");
            setCourts(response.data); // Directly use the fetched courts
         } catch (error) {
            console.log("Error fetching courts:", error);
         }
      };
      fetchCourts();
   }, []);

   if (!courts) {
      return (
         <div className="bg-black h-screen flex justify-center items-center ">
            <h2 className="text-white font-bold text-6xl">
               <FaSpinner className={<FaSpinner /> ? "animate-spin" : ""} />
            </h2>
         </div>
      );
   }

   return (
      <>
         <div className="p-8  bg-black text-white">
            <div className="flex justify-between">
               <h1 className="text-2xl font-bold mb-6">Available Courts</h1>
               <Link to={"/add_court"}>
                  <button className="p-2 text-black bg-green-500 hover:bg-green-600 rounded">
                     Add Court
                  </button>
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 p-4 my-5 ">
               {courts.map((court) => (
                  <div
                     key={court.id}
                     className="bg-green-600 py-4 px-4  text-black rounded-lg h-min  shadow-2xl "
                  >
                     <div className="bg-black p-2 rounded-t-lg">
                        <h2 className="text-center text-xl font-sans font-bold text-green-500">
                           {court.name}
                        </h2>
                     </div>
                     <div>
                        {court.imageUrls[0] ? (
                           <img
                              src={court.imageUrls[0]}
                              alt="Court Image"
                              className="w-full h-60 rounded-b-lg "
                           />
                        ) : (
                           <div className="w-full h-60 rounded-b-lg font-thin flex justify-center items-center">
                              NO IMAGE FOUND
                           </div>
                        )}
                        <div className=""></div>
                     </div>
                     <div className="">
                        <div className="flex justify-between my-2">
                           <p className=" font-bold text-lg">
                              {court.pricePerHour}/hour
                           </p>
                           <button
                              onClick={() =>
                                 setFavourite((prevState) => !prevState)
                              }
                              className={
                                 favourite ? "text-red-600 transition-all" : ""
                              }
                           >
                              <FaHeart
                                 style={{ width: "1.3rem", height: "1.3rem" }}
                              />
                           </button>
                        </div>
                        <p className="mb-1">{court.description}</p>
                        <p className="text-gray-300 mb-4">{court.location}</p>
                        <Link
                           className=" p-2 bg-black text-green-500 hover:text-green-600 transition-all font-semibold rounded"
                           to={`/court/${court.id}`}
                        >
                           Show more details
                        </Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   );
};

export default HomePage;
