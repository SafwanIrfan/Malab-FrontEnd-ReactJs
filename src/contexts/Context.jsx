/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AppContext = createContext({
   data: [],
});

export const AppProvider = ({ children }) => {
   const [data, setData] = useState([]);
   const [isError, setIsError] = useState("");
   const [favourite, setFavourite] = useState(false);
   const [slots, setSlots] = useState([]);
   const [courts, setCourts] = useState([]);
   const [noResults, setNoResults] = useState(false);
   const [searchFocused, setSearchFocused] = useState(false);
   const [searchCourtsResults, setSearchCourtsResults] = useState([]);
   const [input, setInput] = useState("");

   const refreshData = async () => {
      try {
         const response = await axios.get("/courts");
         setData(response.data);
      } catch (error) {
         setIsError(error);
      }
   };
   useEffect(() => {
      const fetchCourts = async () => {
         try {
            const response = await axios.get("http://localhost:8080/courts");
            setCourts(response.data); // Directly use the fetched courts
         } catch (error) {
            console.log("Error fetching courts:", error);
         }
      };
      fetchCourts();
   }, []);

   const handleSearching = async (value) => {
      setInput(value);
      if (value.length >= 1) {
         try {
            const response = await axios.get(
               `http://localhost:8080/courts/search?keyword=${value}`
            );
            setSearchCourtsResults(response.data);
            console.log(response.data);

            setNoResults(response.data?.length === 0);
            console.log(response.data);
         } catch (error) {
            console.error("Error searching:", error);
         }
      } else {
         setSearchCourtsResults([]);
         setNoResults(false);
      }
   };

   const formatTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString("en-US", {
         hour: "numeric",
         minute: "numeric",
         hour12: true,
      });
   };

   const getOneWeek = (dayClosingTime) => {
      const dates = [];
      const today = new Date();
      let finalToday;

      if (dayClosingTime <= nowTime) {
         finalToday = today.getDate() - 1;
      }

      for (let i = 0; i < 7; i++) {
         const nextDate = new Date();
         nextDate.setDate(today.getDate() + i);

         dates.push({
            date: nextDate.toISOString().split("T")[0],

            day: nextDate.toLocaleDateString("en-US", { weekday: "long" }),
         });
      }
      return dates;
   };

   useEffect(() => {
      refreshData();
   }, []);

   return (
      <AppContext.Provider
         value={{
            data,
            isError,
            refreshData,
            favourite,
            setFavourite,
            courts,
            setSlots,
            slots,
            getOneWeek,
            handleSearching,
            noResults,
            searchFocused,
            searchCourtsResults,
            input,
            setSearchFocused,
            formatTime,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export default AppContext;
