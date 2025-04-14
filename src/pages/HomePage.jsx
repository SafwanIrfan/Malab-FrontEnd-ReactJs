import { React, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaHeart, FaSearch, FaSpinner } from "react-icons/fa";
import AppContext from "../contexts/Context";

const HomePage = () => {
   const {
      favourite,
      setFavourite,
      handleSearching,
      input,
      searchCourtsResults,
   } = useContext(AppContext);
   const [courts, setCourts] = useState([]);

   const user = JSON.parse(localStorage.getItem("user"));

   useEffect(() => {
      const fetchCourts = async () => {
         try {
            const response = await axios.get(
               "http://localhost:8080/courts",
               {}
            );
            setCourts(response.data); // Directly use the fetched courts
         } catch (error) {
            console.log("Error fetching courts:", error);
         }
      };
      fetchCourts();
   }, []);
   // useEffect(() => {
   //    const fetchImagesByCourt = async () => {
   //       try {
   //          const response = await axios.get(
   //             `http://localhost:8080/court/${id}/images`,
   //             {}
   //          );
   //          setImages(response.data); // Directly use the fetched images
   //          console.log(response.data);
   //       } catch (error) {
   //          console.log("Error fetching Images:", error);
   //       }
   //    };
   //    fetchImagesByCourt();
   // }, []);

   // if (courts.length == 0) {
   //    return (
   //       <div className="bg-black h-screen flex justify-center items-center ">
   //          <h2 className="text-white font-bold text-6xl">
   //             <FaSpinner className={"animate-spin"} />
   //          </h2>
   //       </div>
   //    );
   // }

   // const handleSearching = async (value) => {
   //    setInput(value);
   //    if (value.length >= 1) {
   //       try {
   //          const response = await axios.get(
   //             `http://localhost:8080/courts/search?keyword=${value}`
   //          );
   //          setSearchCourtsResults(response.data);
   //          console.log(response.data);

   //          setNoResults(response.data?.length === 0);
   //          console.log(response.data);
   //       } catch (error) {
   //          console.error("Error searching:", error);
   //       }
   //    } else {
   //       setSearchCourtsResults([]);
   //       setNoResults(false);
   //    }
   // };

   const items = searchCourtsResults.length > 0 ? searchCourtsResults : courts;

   return (
      <>
         {courts.length > 0 && (
            <div className="p-10  text-black">
               <h1 className="text-center text-2xl text-green-500 font-black mb-6">
                  {user && `Welcome back ${user.username}!`}
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
                        className=" text-black rounded-lg h-min border border-gray-500 hover:shadow-green-color hover:shadow-2xl cursor-pointer transition-all"
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
                                 className="w-full h-52  "
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
                              <button
                                 onClick={() =>
                                    setFavourite((prevState) => !prevState)
                                 }
                                 className={
                                    favourite
                                       ? "text-red-600 transition-all"
                                       : ""
                                 }
                              >
                                 <FaHeart
                                    style={{
                                       width: "1.3rem",
                                       height: "1.3rem",
                                    }}
                                 />
                              </button>
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
