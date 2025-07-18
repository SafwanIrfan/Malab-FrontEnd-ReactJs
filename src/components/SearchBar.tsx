import React from "react";
import { FaSearch } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface Props {
   onClickSearchBar: () => void;
   value: string;
   onChangeText: (text: string) => void;
}
const SearchBar = ({ value, onChangeText, onClickSearchBar }: Props) => {
   const location = useLocation();

   const isSearchPage = location.pathname == "/search/court";

   return (
      <div className="overflow-hidden flex border-[1.5px] bg-white-color hover:border-[1.5px] hover:border-blackberry-color focus-within:border-blackberry-color  hover:bg-gray-100 text-xs w-full sm:text-sm sm:w-96 px-4 py-2 mt-2 mr-2  rounded-full shadow-md transition-all duration-500">
         <FaSearch className="text-gray-800 size-6 mt-1 mr-6 sm:mr-4" />
         <input
            className="text-black focus:outline-none bg-inherit w-96"
            type="text"
            placeholder="name,description or location"
            value={value}
            onClick={onClickSearchBar}
            {...(isSearchPage ? { autoFocus: true } : {})}
            onChange={(e) => onChangeText(e.target.value)}
         />
      </div>
   );
};

export default SearchBar;
