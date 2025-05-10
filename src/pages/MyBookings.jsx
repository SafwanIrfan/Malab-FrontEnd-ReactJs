import axios from "axios";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../contexts/Context";

const MyBookings = () => {
   const [bookings, setBookings] = useState([]);
   const [rawBookings, setRawBookings] = useState([]);
   // const [sortedBookings, setSortedBookings] = useState([]);
   const { formatTime } = useContext(AppContext);
   // const [incoming, setIncoming] = useState([]);
   // const [ongoing, setOngoing] = useState([]);
   // const [previous, setPrevious] = useState([]);
   const { usersId } = useParams();

   const [open, setOpen] = useState({
      incomingBookings: false,
      ongoingBookings: false,
      previousBookings: false,
   });

   useEffect(() => {
      const processedBookings = bookings.map((booking) => {
         let startDate = new Date(booking.date);
         let endDate = new Date(booking.date);

         // If start time is before 12pm, push start date +1 day
         if (booking.startTime < "12:00:00") {
            startDate.setDate(startDate.getDate() + 1);
         }

         // If end time is less than start time → crosses midnight → push end date +1
         if (booking.endTime < booking.startTime) {
            endDate.setDate(endDate.getDate() + 1);
         }

         const start = new Date(
            `${startDate.toISOString().split("T")[0]}T${booking.startTime}`
         );
         const end = new Date(
            `${endDate.toISOString().split("T")[0]}T${booking.endTime}`
         );
         const now = new Date();

         let status;

         if (now < start) {
            status = "incoming";
         } else if (now >= start && now < end) {
            status = "ongoing";
         } else {
            status = "previous";
         }

         return {
            ...booking,
            status,
         };
      });
      setRawBookings(processedBookings);
   }, [bookings]);

   // function sortBookings(bookings) {
   //    return bookings.slice().sort((a, b) => {
   //       // Create start date objects for both bookings

   //       let aDate = new Date(a.date);
   //       let bDate = new Date(b.date);

   //       // If startTime is before 12:00:00, push date +1 (based on your rule)
   //       if (a.startTime < "12:00:00") {
   //          aDate.setDate(aDate.getDate() + 1);
   //       }
   //       if (b.startTime < "12:00:00") {
   //          bDate.setDate(bDate.getDate() + 1);
   //       }

   //       // Combine date + time into a Date object
   //       const aDateTime = new Date(
   //          `${aDate.toISOString().split("T")[0]}T${a.startTime}`
   //       );
   //       const bDateTime = new Date(
   //          `${bDate.toISOString().split("T")[0]}T${b.startTime}`
   //       );

   //       console.log(aDateTime - bDateTime);
   //       return aDateTime - bDateTime;
   //    });
   // }

   const getAdjustedTimestamp = (dateStr, timeStr) => {
      const date = new Date(dateStr);

      // If time is before noon (12:00:00), push to next day
      if (timeStr < "12:00:00") {
         date.setDate(date.getDate() + 1);
      }

      // Combine date + time and get timestamp
      return new Date(
         `${date.toISOString().split("T")[0]}T${timeStr}`
      ).getTime();
   };

   const sortedBookings = rawBookings
      .map((booking) => ({
         ...booking,
         timestamp: getAdjustedTimestamp(booking.date, booking.startTime),
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
   // If result < 0 → a comes before b
   // If result > 0 → a comes after b

   console.log(sortedBookings);

   // useEffect(() => {
   //    const sorted = sortBookings(rawBookings);
   //    setSortedBookings(sorted);
   // }, [rawBookings]);

   // const startSeconds = new Date(bookings[0].startTime).getTime()
   // console.log("START : ", startSeconds)

   const jwtToken = localStorage.getItem("token");

   useEffect(() => {
      const fetchSlotsByUsersId = async () => {
         try {
            const response = await axios.get(
               `http://localhost:8080/user/${usersId}/slots`,
               {
                  headers: {
                     Authorization: `Bearer ${jwtToken}`,
                  },
               }
            );

            setBookings(response.data);
         } catch (error) {
            console.log("Error fetching bookings of user : ", error);
         }
      };
      fetchSlotsByUsersId();
   }, []);

   const toggleOpen = (property) => {
      setOpen((prev) => ({
         ...prev,
         [property]: !prev[property],
      }));
      if (property == "incomingBookings") {
         setOpen((prev) => ({
            ...prev,
            ongoingBookings: false,
            previousBookings: false,
         }));
      } else if (property == "ongoingBookings") {
         setOpen((prev) => ({
            ...prev,
            incomingBookings: false,
            previousBookings: false,
         }));
      } else {
         setOpen((prev) => ({
            ...prev,
            incomingBookings: false,
            ongoingBookings: false,
         }));
      }
   };

   const formatDate = (date) => {
      const formattedDate = new Date(date); // 2025-05-10 -> 10th May 2025
      const formatted = format(formattedDate, "do MMMM yyyy");
      return formatted;
   };

   return (
      <section>
         <nav className="px-8 pt-8 pb-6  shadow-lg flex gap-8">
            <section className="text-balance">
               <div>
                  <button
                     onClick={() => toggleOpen("incomingBookings")}
                     className={
                        open.incomingBookings
                           ? " border-b-2 pb-2 border-b-green-color  sm:text-xl font-semibold transition-all"
                           : "hover:border-b-2 pb-2 hover:border-b-gray-300 sm:text-xl font-semibold transition-all"
                     }
                  >
                     Incoming bookings
                  </button>
               </div>
            </section>

            <section className="text-balance">
               <div className="flex flex-col">
                  <button
                     onClick={() => toggleOpen("ongoingBookings")}
                     className={
                        open.ongoingBookings
                           ? " border-b-2 pb-2 border-b-green-color sm:text-xl font-semibold transition-all"
                           : "hover:border-b-2 pb-2 hover:border-b-gray-300 sm:text-xl font-semibold transition-all"
                     }
                  >
                     Ongoing bookings
                  </button>
               </div>
            </section>

            <section className="text-balance">
               <div className="flex flex-col">
                  <button
                     onClick={() => toggleOpen("previousBookings")}
                     className={
                        open.previousBookings
                           ? " border-b-2 pb-2 border-b-green-color sm:text-xl font-semibold transition-all"
                           : "hover:border-b-2 pb-2 hover:border-b-gray-300 sm:text-xl font-semibold transition-all"
                     }
                  >
                     Previous bookings
                  </button>
               </div>
            </section>
         </nav>

         <section>
            {open.incomingBookings && (
               <div className="flex-col transition-all px-8 py-8">
                  {sortedBookings.map((book) => (
                     <div className="mt-2" key={book.id}>
                        {book.status === "incoming" && (
                           <div className="bg-gray-400/30 p-4 flex-col rounded shadow-lg ">
                              <h1 className="text-xl  font-semibold">
                                 {formatDate(book.date)}
                              </h1>
                              <p className="font-semibold">{book.day}</p>
                              <div className="mt-2 flex gap-2">
                                 <p className="text-green-color font-semibold">
                                    {formatTime(book.startTime)}
                                 </p>
                                 <p className="text-red-500 font-semibold">
                                    {formatTime(book.endTime)}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )}

            {open.ongoingBookings && (
               <div className="flex-col transition-all px-8 py-8">
                  {sortedBookings.map((book) => (
                     <div className="mt-2" key={book.id}>
                        {book.status === "ongoing" && (
                           <div className="bg-gray-400/30 p-4 flex-col rounded shadow-lg ">
                              <h1 className="text-xl  font-semibold">
                                 {formatDate(book.date)}
                              </h1>
                              <p className="transition-all ">{book.day}</p>
                              <div className="flex gap-2">
                                 <p className="text-green-color font-semibold">
                                    {formatTime(book.startTime)}
                                 </p>
                                 <p className="text-red-500 font-semibold">
                                    {formatTime(book.endTime)}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )}

            {open.previousBookings && (
               <div className="flex-col transition-all px-8 py-8">
                  {sortedBookings.map((book) => (
                     <div className="mt-2" key={book.id}>
                        {book.status === "previous" && (
                           <div className="bg-gray-400/30 p-4 flex-col rounded shadow-lg ">
                              <h1 className="text-xl  font-semibold">
                                 {formatDate(book.date)}
                              </h1>
                              <p className="transition-all ">{book.day}</p>
                              <div className="flex gap-2">
                                 <p className="text-green-color font-semibold">
                                    {formatTime(book.startTime)}
                                 </p>
                                 <p className="text-red-500 font-semibold">
                                    {formatTime(book.endTime)}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  ))}
               </div>
            )}
         </section>
      </section>
   );
};

export default MyBookings;
