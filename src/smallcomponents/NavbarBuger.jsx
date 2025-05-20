import { NavLink } from "react-router-dom";

const NavbarBuger = () => {
   return (
      <div className="text-center bg-gray-200 text-black font-mono h-auto p-4 rounded">
         <div className="text-center mb-4 ">
            <label>Location</label>
            <select
               defaultValue="Choose region"
               name="pakistan"
               id="pakistan"
               className="block ml-2 border-2 p-2 w-auto text-gray-800 transition-all"
            >
               <option value="Karachi">Karachi</option>
            </select>
         </div>
         <div className="mb-2">
            <NavLink className=" hover:text-green-600 text-base">
               Courts
            </NavLink>
         </div>
         <div className="">
            <NavLink
               className=" p-2 text-gray-800 hover:text-green-600 transition-all"
               to="/identification"
            >
               <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-2 w-auto rounded transition-all">
                  Login
               </button>
            </NavLink>
         </div>
      </div>
   );
};

export default NavbarBuger;
