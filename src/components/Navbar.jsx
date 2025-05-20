import { FaBars } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NavbarBuger from "../smallcomponents/NavbarBuger";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import AppContext from "../contexts/Context";
import appLogo from "../assets/applogo.svg";
import SearchBar from "./SearchBar";
const Navbar = () => {
   const { noResults } = useContext(AppContext);
   const { currentUser } = useAuth();
   const [showNavbarBuger, setShowNavbarBurger] = useState(false);

   const jwtToken = localStorage.getItem("token");
   const username = JSON.parse(localStorage.getItem("user"));
   console.log(username);

   const navigate = useNavigate();

   const location = useLocation();
   const isHomePage = location.pathname === "/";

   const handleLogout = async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Successfully Logged Out!");
      navigate("/auth/login");
   };

   const handleLogin = () => {
      navigate("/auth/login");
   };

   useEffect(() => {
      console.log(jwtToken);
   }, []);

   const usersId = currentUser?.id;

   return (
      <section className="border-b-2 border-sgreen-color shadow-xl">
         <div className=" px-8 py-4 font-mono flex  sm:justify-between rounded-b-lg ">
            <div className="flex items-center text-center w-20 ">
               <NavLink to="/" className="">
                  <img className=" w-16 md:w-20 mr-4" src={appLogo} />
               </NavLink>
            </div>
            {isHomePage && (
               <div>
                  <div className="hidden sm:block">
                     <SearchBar />
                  </div>
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
            <div className="absolute  top-2 right-4   p-4  sm:flex sm:items-center sm:gap-2 md:gap-4 sm:z-0 sm:p-0 sm:static">
               <div className="text-balance hidden sm:block">
                  <NavLink
                     className=" p-2 text-sm md:text-base hover:text-green-color transition-all"
                     to={`/user/${usersId}/slots`}
                  >
                     My Bookings
                  </NavLink>
               </div>

               <div className=" hidden sm:block">
                  <button
                     onClick={jwtToken ? handleLogout : handleLogin}
                     className="bg-green-color hover:bg-sgreen-color hover:text-black text-white p-2 text-sm md:text-base  md:py-2 md:px-4  w-auto rounded transition-all"
                  >
                     {jwtToken ? "Logout" : "Login"}
                  </button>
               </div>

               <div className="block sm:hidden text-lg text-right">
                  <button
                     className="pt-2"
                     onClick={() =>
                        setShowNavbarBurger((prevState) => !prevState)
                     }
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
                  <div>{showNavbarBuger && <NavbarBuger />}</div>
               </div>
            </div>
         </div>
      </section>
   );
};

export default Navbar;
