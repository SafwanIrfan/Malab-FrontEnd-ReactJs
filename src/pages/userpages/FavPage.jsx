import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CourtCard from "../../components/CourtCard";
import Button from "../../smallcomponents/Button";
import { getToken } from "../../utils/authToken";
import { useContext } from "react";
import AppContext from "../../contexts/Context";
import { FaHeart } from "react-icons/fa";

const FavPage = () => {
   const { usersId } = useParams();
   const { setShowNavbarBurger } = useContext(AppContext);

   const navigate = useNavigate();

   const token = getToken();

   const fetchUserFavCourts = async () => {
      const courtIds = userFav?.map((fav) => fav.id?.courtId);
      const courtResponses = await Promise.all(
         courtIds.map((id) =>
            axios.get(`http://localhost:8080/court/${id}`, {
               headers: { Authorization: `Bearer ${token}` },
            })
         )
      );
      return courtResponses.map((res) => res.data);
   };

   const {
      data: userFav,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["userFav", usersId],
      queryFn: () =>
         axios
            .get(`http://localhost:8080/user/${usersId}/fav`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((res) => res.data),
      enabled: !!usersId, // makes sure query runs only when usersId is available
   });
   console.log(userFav);

   const { data: userCourtsFav } = useQuery({
      queryKey: ["userCourtsFav", userFav?.map((fav) => fav.id)],
      refetchInterval: 200,
      queryFn: fetchUserFavCourts,
      enabled: !!userFav && userFav.length > 0,
   });

   if (isLoading) navigate("/loading");
   if (error) console.log("Error : ", error);

   if (userFav?.length == 0) {
      return (
         <div
            onClick={() => setShowNavbarBurger(false)}
            className="px-4 sm:px-8 flex flex-col gap-6 justify-center items-center min-h-screen"
         >
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-8 shadow-lg mb-4">
               <FaHeart className="text-6xl text-red-500" />
            </div>
            <h1 className="text-green-color text-2xl sm:text-3xl text-center text-balance font-bold">
               You don't have any favorite courts yet
            </h1>
            <p className="text-gray-600 text-center">Start adding courts to your favorites!</p>
            <Button title="Browse Courts" action={() => navigate("/user")} />
         </div>
      );
   }

   return (
      <section className="px-4 sm:px-6 lg:px-10 py-6 sm:py-10 min-h-screen">
         <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-blackberry-color mb-2">
               Your Choice Matters...
            </h2>
            <p className="text-gray-600 text-lg">
               {userCourtsFav?.length || 0} favorite court{userCourtsFav?.length !== 1 ? 's' : ''}
            </p>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {userCourtsFav?.map((court) => (
               <CourtCard key={court.id} {...court} />
            ))}
         </div>
      </section>
   );
};

export default FavPage;
