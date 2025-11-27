import { FaBars } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NavbarBuger from "../smallcomponents/NavbarBuger";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppContext from "../contexts/Context";
import appLogo from "../assets/applogo.svg";
import { AvatarIcon } from "@radix-ui/react-icons";
import { clearAuth, getDecodedToken, getToken } from "../utils/authToken";

const Navbar = () => {
   const { noResults, showNavbarBuger, setShowNavbarBurger } =
      useContext(AppContext);

   const token = getToken();

   const decodedToken = getDecodedToken();

   const navigate = useNavigate();

   const location = useLocation();
   const isHomePage = location.pathname === "/";

   const handleLogout = async () => {
      clearAuth();
      toast.success("Successfully Logged Out!");
      navigate("/auth/login");
   };

   const handleLogin = () => {
      navigate("/auth/login");
   };

   useEffect(() => {
      console.log(token);
   }, []);

   const usersId = decodedToken?.usersId;

   return (
      <section className="border-b-2 border-blackberry-color shadow-xl">
         <div className="relative px-8 py-4 font-mono flex justify-between rounded-b-lg ">
            <div className="flex items-center text-center ">
               <NavLink to="/user" className="">
                  <img className=" w-28 md:w-28 mr-4" src={appLogo} />
               </NavLink>
            </div>
            <div className="sm:hidden text-lg flex items-center  ">
               <button
                  className=""
                  onClick={() => setShowNavbarBurger((prevState) => !prevState)}
               >
                  <FaBars
                     style={
                        showNavbarBuger
                           ? {
                                transform: "rotate(90deg)",
                                transition: "0.3s",
                             }
                           : {
                                transform: "rotate(0deg)",
                                transition: "0.3s",
                             }
                     }
                  />
               </button>

               <div
                  className={`absolute right-6 top-12 z-10 ${
                     showNavbarBuger && "border-[2px] border-blackberry-color"
                  } rounded`}
               >
                  {showNavbarBuger && <NavbarBuger />}
               </div>
            </div>
            {isHomePage && (
               <div className="hidden sm:block">
                  <div className="hidden sm:block">{/* <SearchBar /> */}</div>
                  <div className="fixed mx-6">
                     <p
                        className={
                           noResults
                              ? "text-red-500 font-bold p-2 bg-gray-200  "
                              : "invisible"
                        }
                     >
                        No Court found...
                     </p>{" "}
                  </div>
               </div>
            )}

            {/* <div className="flex items-center gap-6 "> */}
            <div className="absolute z-10 top-2 right-4 p-4 hidden sm:flex sm:items-center sm:gap-2 md:gap-4 sm:z-0 sm:p-0 sm:static">
               <div className="text-balance hidden sm:block">
                  <NavLink
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

               <div className="text-balance hidden sm:block">
                  <NavLink
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

               <div className=" hidden sm:block">
                  <button
                     onClick={token ? handleLogout : handleLogin}
                     className="bg-green-color hover:bg-sgreen-color hover:text-black text-white p-2 text-sm md:text-base  md:py-2 md:px-4  w-auto rounded transition-all"
                  >
                     {token ? "Logout" : "Login"}
                  </button>
               </div>
               <button>
                  {decodedToken?.userImageUrl ? (
                     <div className=" w-10 h-10 rounded-full border-2 border-black ">
                        <img
                           className="rounded-full"
                           src={decodedToken?.userImageUrl}
                        />
                     </div>
                  ) : (
                     <AvatarIcon className="w-10 h-10" />
                  )}
               </button>
            </div>
         </div>
      </section>
   );
};

export default Navbar;
