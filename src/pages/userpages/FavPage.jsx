import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CourtCard from "../../components/CourtCard";
import Button from "../../smallcomponents/Button";
import { getToken } from "../../utils/authToken";
import { useContext } from "react";
import AppContext from "../../contexts/Context";

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
            className="px-8 flex flex-col gap-4 justify-center items-center min-h-screen"
         >
            <h1 className="text-green-color text-3xl text-center text-balance">
               You have not any favorite courts
            </h1>

            <Button title="See Courts" action={() => navigate("/")} />
         </div>
      );
   }

   console.log(userCourtsFav);

   return (
      <section className="p-10">
         <h2 className="text-center text-3xl font-black">
            Your Choice Matters...
         </h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10  my-5 ">
            {userCourtsFav?.map((court) => (
               <CourtCard key={court.id} {...court} />
            ))}
         </div>
      </section>
   );
};

export default FavPage;
