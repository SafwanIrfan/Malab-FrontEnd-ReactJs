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

   const isSearchPage = location.pathname == "/user/search/court";

   return (
      <div className="overflow-hidden flex items-center border-2 bg-white hover:border-green-color focus-within:border-green-color focus-within:ring-2 focus-within:ring-green-color/20 text-sm w-full px-4 sm:px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
         <FaSearch className="text-gray-500 size-5 mr-3 flex-shrink-0" />
         <input
            className="text-black focus:outline-none bg-transparent w-full placeholder-gray-400"
            type="text"
            placeholder="Search by name, description or location..."
            value={value}
            onClick={onClickSearchBar}
            {...(isSearchPage ? { autoFocus: true } : {})}
            onChange={(e) => onChangeText(e.target.value)}
         />
      </div>
   );
};

export default SearchBar;
