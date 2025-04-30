import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

const MyBookings = () => {
   const [bookings, setBookings] = useState([]);
   const { userId } = useParams();

   const jwtToken = localStorage.getItem("token");

   try {
      const response = axios.get(`http://localhost:8080/user/${userId}/slots`, {
         headers: {
            Authorization: `Bearer ${jwtToken}`,
         },
      });
      console.log(response);
   } catch (error) {
      console.log("Error fetching bookings of user : ", error);
   }

   return <section className="px-8 py-10"></section>;
};

export default MyBookings;
