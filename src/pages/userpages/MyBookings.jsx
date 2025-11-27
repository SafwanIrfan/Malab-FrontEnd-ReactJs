import axios from "axios";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../contexts/Context";
import { getToken } from "../../utils/authToken";

const formatDate = (date) => {
   const formattedDate = new Date(date); // 2025-05-10 -> 10th May 2025
   const formatted = format(formattedDate, "do MMMM yyyy");
   return formatted;
};

const BookingCard = (props) => {
   const { bookingStatus, ...book } = props;
   const { setShowNavbarBurger } = useContext(AppContext);

   const { formatTime } = useContext(AppContext);

   console.log(book);

   if (!book) return null;
   return (
      <div onClick={() => setShowNavbarBurger(false)} className="mt-2">
         {book.status === bookingStatus && (
            <div className="bg-white/70 p-4 flex-col border-[1px] border-blackberry-color rounded shadow-lg">
               <h1 className="text-3xl text-black font-serif">
                  {book.courtName}
               </h1>
               <h1 className="text-xl  font-semibold">
                  {formatDate(book.date)}
               </h1>
               <p className="transition-all ">{book.day}</p>
               <div className="flex gap-2">
                  <p className="text-green-color font-semibold">
                     {formatTime(book.startTime)}
                  </p>{" "}
                  <p className="text-red-500 font-semibold">
                     {formatTime(book.endTime)}
                  </p>
               </div>
            </div>
         )}
      </div>
   );
};

const MyBookings = () => {
   const [bookings, setBookings] = useState([]);
   const [rawBookings, setRawBookings] = useState([]);
   const { usersId } = useParams();
   const { setShowNavbarBurger } = useContext(AppContext);

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

   const token = getToken();

   useEffect(() => {
      const fetchSlotsByUsersId = async () => {
         try {
            const response = await axios.get(
               `http://localhost:8080/user/${usersId}/slots`,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
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

   return (
      <section onClick={() => setShowNavbarBurger(false)}>
         <nav className="px-8 pt-8 pb-6  shadow-lg flex gap-8">
            <section className="text-balance">
               <div>
                  <button
                     onClick={() => toggleOpen("incomingBookings")}
                     className={
                        open.incomingBookings
                           ? " border-b-2 pb-2 border-b-green-color  sm:text-xl font-semibold transition-all"
                           : "hover:border-b-2 pb-2 hover:border-b-green-color/20 sm:text-xl font-semibold transition-all"
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
                           : "hover:border-b-2 pb-2 hover:border-b-green-color/20 sm:text-xl font-semibold transition-all"
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
                           : "hover:border-b-2 pb-2 hover:border-b-green-color/20 sm:text-xl font-semibold transition-all"
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
                     <BookingCard
                        key={book.id}
                        bookingStatus="incoming"
                        {...book}
                     />
                  ))}
               </div>
            )}

            {open.ongoingBookings && (
               <div className="flex-col transition-all px-8 py-8">
                  {sortedBookings.map((book) => (
                     <BookingCard
                        key={book.id}
                        bookingStatus="ongoing"
                        {...book}
                     />
                  ))}
               </div>
            )}

            {open.previousBookings && (
               <div className="flex-col transition-all px-8 py-8">
                  {sortedBookings.map((book) => (
                     <BookingCard
                        key={book.id}
                        bookingStatus="previous"
                        {...book}
                     />
                  ))}
               </div>
            )}
         </section>
      </section>
   );
};

export default MyBookings;
