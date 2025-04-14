import { FaBars } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import NavbarBuger from "../smallcomponents/NavbarBuger";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import AppContext from "../contexts/Context";
import appLogo from "../assets/applogo.svg";
const Navbar = () => {
   const { handleSearching, input, setSearchFocused, noResults } =
      useContext(AppContext);
   const [showNavbarBuger, setShowNavbarBurger] = useState(false);

   const jwtToken = localStorage.getItem("token");

   const navigate = useNavigate();

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

   return (
      <div className=" border-b-2 border-sgreen-color shadow-xl">
         <div className=" px-8 py-4 font-mono flex  justify-between rounded-b-lg ">
            <div className="flex items-center text-center ">
               <NavLink to="/" className="">
                  <img className=" w-20" src={appLogo} />
               </NavLink>
            </div>
            <div className="flex bg-gray-200  w-max p-3 mt-2 px-8 rounded-full">
               <input
                  className="text-black focus:outline-none  bg-inherit w-96"
                  type="search"
                  placeholder="Search by name,description or location"
                  value={input}
                  onChange={(e) => {
                     handleSearching(e.target.value);
                  }}
                  onFocus={() => setSearchFocused(true)} // Set searchFocused to true when search bar is focused
                  onBlur={() => setSearchFocused(false)} // Set searchFocused to false when search bar loses focus
               />
               <FaSearch className="text-xl text-black rotate-90 ml-4 mt-1" />
            </div>
            <p
               className={
                  noResults ? "text-red-500 mt-4 font-bold " : "invisible"
               }
            >
               No Court found...
            </p>{" "}
            {/* <div className="flex items-center gap-6 "> */}
            <div className="absolute  top-2 right-4   p-4 z-50 sm:flex sm:items-center sm:gap-6 sm:z-0 sm:p-0 sm:static">
               <div className="text-center hidden sm:block">
                  <label>Location</label>
                  <select
                     defaultValue="Choose region"
                     name="pakistan"
                     id="pakistan"
                     className="px-4 text-white ml-2 border-none bg-green-color p-2 w-auto cursor-pointer hover:bg-sgreen-color hover:text-black transition-all"
                  >
                     <option value="Karachi">Karachi</option>
                  </select>
               </div>
               <div className=" hidden sm:block">
                  <NavLink
                     className=" p-2  hover:text-gray-300 transition-all"
                     to="/courts"
                  >
                     Courts
                  </NavLink>
               </div>

               <div className=" hidden sm:block">
                  <button
                     onClick={jwtToken ? handleLogout : handleLogin}
                     className="bg-green-color hover:bg-sgreen-color hover:text-black text-white py-2 px-4 w-auto rounded transition-all"
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
      </div>
   );
};

export default Navbar;
