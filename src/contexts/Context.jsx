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
   const { id } = useParams();

   // const fetchSlots = async () => {
   //    try {
   //       const response = await axios.get(
   //          `http://localhost:8080/court/${id}/slots`
   //       );
   //       console.log(response.data);
   //       setSlots(response.data);
   //    } catch (error) {
   //       console.log("Error Fetching Slots : ", error);
   //    }
   // };

   // useEffect(() => {
   //    fetchSlots();
   // }, []);

   const refreshData = async () => {
      try {
         const response = await axios.get("/courts");
         setData(response.data);
      } catch (error) {
         setIsError(error);
      }
   };

   const getOneWeek = () => {
      const dates = [];
      const today = new Date();

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

            setSlots,
            slots,
            getOneWeek,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};

export default AppContext;
