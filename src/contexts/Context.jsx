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
   const [searchFocused, setSearchFocused] = useState(false);
   const [showNavbarBuger, setShowNavbarBurger] = useState(false);

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

   return (
      <AppContext.Provider
         value={{
            isError,
            favourite,
            setFavourite,
            setSlots,
            slots,
            getOneWeek,
            searchFocused,
            setSearchFocused,
            formatTime,
            showNavbarBuger,
            setShowNavbarBurger,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export default AppContext;
