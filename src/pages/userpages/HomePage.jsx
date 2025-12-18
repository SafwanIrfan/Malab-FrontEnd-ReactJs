import axios from "axios";
import { useNavigate } from "react-router-dom";
import CourtCard from "../../components/CourtCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../smallcomponents/Loading";
import SearchBar from "../../components/SearchBar";
import { getDecodedToken, getToken } from "../../utils/authToken";
import { useContext, useEffect } from "react";
import AppContext from "../../contexts/Context";

const HomePage = () => {
   const navigate = useNavigate();

   const { setShowNavbarBurger } = useContext(AppContext);

   const token = getToken();

   const decodedToken = getDecodedToken();

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

   useEffect(() => {
      if (token?.split(".")?.length !== 3) {
         navigate("/auth/login");
      }
   }, [token]);

   const {
      data: courts,
      isLoading,
      error: courtsError,
   } = useQuery({
      queryKey: ["courts"],
      queryFn: () =>
         axios
            .get("http://localhost:8080/user/courts/APPROVED", {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((res) => res.data),
   });

   if (isLoading) return <Loading />;

   // useEffect(() => {
   //    fetchCourts();
   //    console.log(courts);
   // }, []);

   if (courtsError)
      return <p className="text-center mt-20">Error : {courtsError.message}</p>;

   return (
      <>
         {courts?.length >= 0 && (
            <div
               onClick={() => setShowNavbarBurger(false)}
               className="min-h-screen px-4 sm:px-6 lg:px-10 py-8 sm:py-10 text-black"
            >
               {decodedToken && (
                  <div className="max-w-md mx-auto mb-8">
                     <div className="border-2 border-blackberry-color overflow-hidden rounded-full bg-gradient-to-r from-green-color to-sgreen-color transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300">
                        <h1 className="text-center text-xl sm:text-2xl py-3 px-6 sm:px-10 text-white font-black animate-marquee">
                           {`Welcome ${decodedToken.sub}!`}
                        </h1>
                     </div>
                  </div>
               )}
               <div className="flex justify-center my-6 sm:my-8">
                  <div className="w-full max-w-2xl">
                     <SearchBar
                        onClickSearchBar={() => navigate("/user/search/court")}
                        value=""
                        onChangeText={() => {}}
                     />
                  </div>
               </div>
               <div className="flex justify-between items-center mt-12 mb-8">
                  <h1 className="text-3xl sm:text-4xl font-black text-blackberry-color">
                     Available Courts
                  </h1>
               </div>
               {courts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                     <p className="text-2xl text-gray-600 mb-4">No courts available at the moment</p>
                     <p className="text-gray-500">Check back later for new courts!</p>
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 my-5">
                     {courts.map((court) => (
                        <CourtCard key={court.id} {...court} />
                     ))}
                  </div>
               )}
            </div>
         )}
      </>
   );
};

export default HomePage;
