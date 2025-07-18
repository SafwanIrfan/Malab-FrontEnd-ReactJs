import axios from "axios";
import { useNavigate } from "react-router-dom";
import CourtCard from "../components/CourtCard";
import { useQuery } from "@tanstack/react-query";
import Loading from "../smallcomponents/Loading";
import Button from "../smallcomponents/Button";
import SearchBar from "../components/SearchBar";
import { getDecodedToken } from "../utils/authToken";

const HomePage = () => {
   const navigate = useNavigate();

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

   const {
      data: courts,
      isLoading,
      error: courtsError,
   } = useQuery({
      queryKey: ["courts"],
      queryFn: () =>
         axios.get("http://localhost:8080/courts", {}).then((res) => res.data),
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
            <div className="p-10 text-black">
               {decodedToken && (
                  <div className="w-[400px] border-[1px] border-blackberry-color overflow-hidden mx-auto rounded-full  bg-green-color transition-all shadow-lg">
                     <h1 className="text-center text-2xl py-2 px-10 text-white animate-marquee font-black ">
                        {`Welcome ${decodedToken.sub}!`}
                     </h1>
                  </div>
               )}
               <div className="flex justify-center my-2">
                  <SearchBar
                     onClickSearchBar={() => navigate("/search/court")}
                  />
               </div>
               <div className="flex justify-between mt-10">
                  <h1 className="text-2xl font-black mb-6">Available Courts</h1>
                  <Button
                     title="Add Court"
                     action={() => navigate("add_court")}
                  />
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  my-5 ">
                  {courts.map((court) => (
                     <CourtCard key={court.id} {...court} />
                  ))}
               </div>
            </div>
         )}
      </>
   );
};

export default HomePage;
