import React, { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import AppContext from "../contexts/Context";

const SearchBar = () => {
   const { handleSearching, input, setSearchFocused } = useContext(AppContext);
   return (
      <div className="flex justify-around bg-gray-200 w-full text-sm lg:w-full   sm:w-80 p-3 mt-2 mr-2  rounded-full">
         <input
            className="text-black focus:outline-none  bg-inherit w-96"
            type="search"
            placeholder="name,description or location"
            value={input}
            onChange={(e) => {
               handleSearching(e.target.value);
            }}
            onFocus={() => setSearchFocused(true)} // Set searchFocused to true when search bar is focused
            onBlur={() => setSearchFocused(false)} // Set searchFocused to false when search bar loses focus
         />
         <FaSearch className="  text-black rotate-90 ml-2 mt-1" />
      </div>
   );
};

export default SearchBar;
