/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext({
   data: [],
});

export const AppProvider = ({ children }) => {
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
         fetchCourts();
      } catch (error) {
         setIsError(error);
      }
   };

   const fetchCourts = async () => {
      try {
         const response = await axios.get("http://localhost:8080/courts");
         setCourts(response.data); // Directly use the fetched courts
      } catch (error) {
         console.log("Error fetching courts:", error);
      }
   };
   useEffect(() => {
      fetchCourts();
   }, []);

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

   const getOneWeek = () => {
      const dates = [];
      const today = new Date();
      // let finalToday;

      // if (dayClosingTime <= nowTime) {
      //    finalToday = today.getDate() - 1;
      // }

      for (let i = 0; i < 7; i++) {
         const nextDate = new Date();
         nextDate.setDate(today.getDate() + i);

         dates.push({
            date: nextDate.toLocaleDateString("sv-SE"),

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
            isError,
            refreshData,
            favourite,
            setFavourite,
            courts,
            setSlots,
            slots,
            getOneWeek,
            noResults,
            searchFocused,
            searchCourtsResults,
            input,
            setSearchFocused,
            formatTime,
            fetchCourts,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export default AppContext;
