import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDecodedToken, getToken } from "../utils/authToken";
import { useContext } from "react";
import AppContext from "../contexts/Context";

const NavbarBuger = () => {
   const token = getToken();
   const decoded = getDecodedToken();

   const { setShowNavbarBurger } = useContext(AppContext);

   const usersId = decoded?.usersId;
   const navigate = useNavigate();

   const handleLogout = async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("username");

      toast.success("Successfully Logged Out!");
      navigate("/auth/login");
   };

   const handleLogin = () => {
      navigate("/auth/login");
   };

   return (
      <div className=" text-center flex flex-col bg-gray-200 text-black font-mono h-auto p-4 rounded gap-2">
         <div className="text-balance">
            <NavLink
               onClick={() => setShowNavbarBurger(false)}
               className={
                  location.pathname == `/user/${usersId}/slots`
                     ? "p-2 text-sm md:text-base hover:text-green-color transition-all border-b-2 border-b-green-color"
                     : "p-2 text-sm md:text-base hover:text-green-color transition-all"
               }
               to={`/user/${usersId}/slots`}
            >
               Bookings
            </NavLink>
         </div>
         <div className="text-balance">
            <NavLink
               onClick={() => setShowNavbarBurger(false)}
               className={
                  location.pathname == `/user/${usersId}/fav`
                     ? "p-2 text-sm md:text-base hover:text-green-color transition-all border-b-2 border-b-green-color"
                     : "p-2 text-sm md:text-base hover:text-green-color transition-all"
               }
               to={`/user/${usersId}/fav`}
            >
               Favorites
            </NavLink>
         </div>
         <div>
            <button
               onClick={
                  (() => setShowNavbarBurger(false),
                  token !== null ? handleLogout : handleLogin)
               }
               className="bg-green-color hover:bg-sgreen-color hover:text-black text-white mt-2 p-2 text-sm md:text-base  md:py-2 md:px-4  w-auto rounded transition-all"
            >
               {token !== null ? "Logout" : "Login"}
            </button>
         </div>
      </div>
   );
};

export default NavbarBuger;
