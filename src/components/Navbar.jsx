import { FaBars } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NavbarBuger from "../smallcomponents/NavbarBuger";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AppContext from "../contexts/Context";
import appLogo from "../assets/applogo.svg";
import { AvatarIcon } from "@radix-ui/react-icons";
import { clearAuth, getDecodedToken, getToken } from "../utils/authToken";
import ConfirmationModal from "../smallcomponents/ConfirmationModal";

const Navbar = () => {
   const { noResults, showNavbarBuger, setShowNavbarBurger } =
      useContext(AppContext);

   const token = getToken();

   const decodedToken = getDecodedToken();

   const navigate = useNavigate();

   const location = useLocation();
   const isHomePage = location.pathname === "/";

   const [showLogoutModal, setShowLogoutModal] = useState(false);

   const handleLogout = async () => {
      setShowLogoutModal(true);
   };

   const confirmLogout = () => {
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
      <section className="border-b-2 border-blackberry-color shadow-xl bg-white/95 backdrop-blur-sm sticky top-0 z-50">
         <div className="relative px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
               <NavLink to="/user" className="group">
                  <img 
                     className="w-28 md:w-32 mr-4 transition-transform duration-300 group-hover:scale-105" 
                     src={appLogo} 
                     alt="PlayWithEase Logo"
                  />
               </NavLink>
            </div>
            <div className="sm:hidden text-lg flex items-center">
               <button
                  className="p-2 rounded-lg hover:bg-white-color transition-colors duration-200"
                  onClick={() => setShowNavbarBurger((prevState) => !prevState)}
                  aria-label="Toggle menu"
               >
                  <FaBars
                     className={`transition-transform duration-300 ${
                        showNavbarBuger ? "rotate-90" : "rotate-0"
                     }`}
                  />
               </button>

               <div
                  className={`absolute right-4 top-16 z-20 ${
                     showNavbarBuger && "border-2 border-blackberry-color shadow-2xl"
                  } rounded-lg bg-white overflow-hidden transition-all duration-300`}
               >
                  {showNavbarBuger && <NavbarBuger />}
               </div>
            </div>
            {isHomePage && (
               <div className="hidden sm:block">
                  <div className="fixed mx-6">
                     <p
                        className={`transition-all duration-300 ${
                           noResults
                              ? "text-red-500 font-bold p-3 bg-red-50 border border-red-200 rounded-lg shadow-md"
                              : "invisible opacity-0"
                        }`}
                     >
                        No Court found...
                     </p>
                  </div>
               </div>
            )}

            <div className="absolute z-10 top-2 right-4 p-4 hidden sm:flex sm:items-center sm:gap-3 md:gap-6 sm:z-0 sm:p-0 sm:static">
               <div className="text-balance hidden sm:block">
                  <NavLink
                     className={`relative px-3 py-2 text-sm md:text-base font-medium transition-all duration-200 ${
                        location.pathname == `/user/${usersId}/slots`
                           ? "text-green-color border-b-2 border-b-green-color"
                           : "text-gray-700 hover:text-green-color"
                     }`}
                     to={`/user/${usersId}/slots`}
                  >
                     Bookings
                  </NavLink>
               </div>

               <div className="text-balance hidden sm:block">
                  <NavLink
                     className={`relative px-3 py-2 text-sm md:text-base font-medium transition-all duration-200 ${
                        location.pathname == `/user/${usersId}/fav`
                           ? "text-green-color border-b-2 border-b-green-color"
                           : "text-gray-700 hover:text-green-color"
                     }`}
                     to={`/user/${usersId}/fav`}
                  >
                     Favorites
                  </NavLink>
               </div>

               <div className="hidden sm:block">
                  <button
                     onClick={token ? handleLogout : handleLogin}
                     className="bg-green-color hover:bg-sgreen-color hover:text-black text-white px-4 py-2 text-sm md:text-base rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                     {token ? "Logout" : "Login"}
                  </button>
               </div>
               <button className="group">
                  {decodedToken?.userImageUrl ? (
                     <div className="w-10 h-10 rounded-full border-2 border-blackberry-color overflow-hidden transition-transform duration-200 group-hover:scale-110 shadow-md">
                        <img
                           className="w-full h-full object-cover"
                           src={decodedToken?.userImageUrl}
                           alt="User avatar"
                        />
                     </div>
                  ) : (
                     <div className="w-10 h-10 rounded-full border-2 border-blackberry-color bg-white-color flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-md">
                        <AvatarIcon className="w-6 h-6 text-blackberry-color" />
                     </div>
                  )}
               </button>
            </div>
         </div>
         <ConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
            title="Logout"
            message="Are you sure you want to logout? You will need to login again to access your account."
            confirmText="Logout"
            cancelText="Cancel"
            isDanger={false}
         />
      </section>
   );
};

export default Navbar;
