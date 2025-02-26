import { FaBars } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import NavbarBuger from "../smallcomponents/NavbarBuger";
import { useState } from "react";

const Navbar = () => {
   const [showNavbarBuger, setShowNavbarBurger] = useState(false);

   return (
      <div className=" bg-green-600">
         <div className=" px-8 py-4 font-mono flex  justify-between rounded-b-lg ">
            <div>
               <div className="flex items-center text-center ">
                  <NavLink to="/" className="flex ">
                     <p className="text-xl text-white font-bold font-sans pt-2 ">
                        <p>
                           MAL<span className="text-black text-3xl">ع</span>
                           AB
                        </p>
                     </p>
                  </NavLink>
               </div>
            </div>
            {/* <div className="flex items-center gap-6 "> */}
            <div className="absolute text-gray-200 hover:text-gray-100 top-2 right-4   p-4 z-50 sm:flex sm:items-center sm:gap-6 sm:z-0 sm:p-0 sm:static">
               <div className="text-center hidden sm:block">
                  <label>Location</label>
                  <select
                     defaultValue="Choose region"
                     name="pakistan"
                     id="pakistan"
                     className="px-4 ml-2 border-2 bg-black p-2 w-auto cursor-pointer hover:text-green-600 transition-all"
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
                  <NavLink
                     className=" p-2 text-gray-800 hover:text-green-600 transition-all"
                     to="/identification"
                  >
                     <button className="bg-black hover:text-green-500 text-white py-2 px-4 w-auto rounded transition-all">
                        Login
                     </button>
                  </NavLink>
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
