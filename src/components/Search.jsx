// import axios from "axios";
// import React, { useState } from "react";

// const Search = () => {
//    const [input, setInput] = useState("");
//    const [searchResults, setSearchResults] = useState([]);
//    const [noResults, setNoResults] = useState(false);
//    const [searchFocused, setSearchFocused] = useState(false);
//    const [showSearchResults, setShowSearchResults] = useState(false);
//    const

//    // const handleChange = async (value) => {
//    //    setInput(value);
//    //    if (value.length >= 1) {
//    //       setShowSearchResults(true);
//    //       try {
//    //          const response = await axios.get(
//    //             `http://localhost:8080/api/products/search?keyword=${value}`
//    //          );
//    //          setSearchResults(response.data);
//    //          setNoResults(response.data.length === 0);
//    //          console.log(response.data);
//    //       } catch (error) {
//    //          console.error("Error searching:", error);
//    //       }
//    //    } else {
//    //       setShowSearchResults(false);
//    //       setSearchResults([]);
//    //       setNoResults(false);
//    //    }
//    // };

//    return (
//       <div>
//          <input
//             className="form-control me-2"
//             type="search"
//             placeholder="Search"
//             aria-label="Search"
//             value={input}
//             onChange={(e) => handleChange(e.target.value)}
//             onFocus={() => setSearchFocused(true)} // Set searchFocused to true when search bar is focused
//             onBlur={() => setSearchFocused(false)} // Set searchFocused to false when search bar loses focus
//          />
//       </div>
//    );
// };

// export default Search;
