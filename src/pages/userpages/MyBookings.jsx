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

   if (!book) return null;
   
   const statusColors = {
      incoming: "from-blue-500 to-blue-600",
      ongoing: "from-green-color to-sgreen-color",
      previous: "from-gray-400 to-gray-500"
   };

   return (
      <div onClick={() => setShowNavbarBurger(false)} className="mt-4">
         {book.status === bookingStatus && (
            <div className="bg-white/90 backdrop-blur-sm flex-col border-2 border-blackberry-color rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden">
               <div className={`w-full h-2.5 bg-gradient-to-r ${statusColors[bookingStatus] || "from-gray-400 to-gray-500"}`}></div>
               <div className="p-5 sm:p-6">
                  <h1 className="text-2xl sm:text-3xl text-black font-bold mb-2">
                     {book.courtName}
                  </h1>
               <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                     {formatDate(book.date)}
                  </h2>
               </div>
               <p className="text-gray-600 mb-4 capitalize font-medium">{book.day}</p>
               <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-green-color"></div>
                     <p className="text-green-color font-semibold text-lg">
                        {formatTime(book.startTime)}
                     </p>
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <p className="text-red-500 font-semibold text-lg">
                        {formatTime(book.endTime)}
                     </p>
                  </div>
               </div>
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
      <section onClick={() => setShowNavbarBurger(false)} className="min-h-screen">
         <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-4 bg-white/50 backdrop-blur-sm border-b-2 border-blackberry-color">
            <h1 className="text-3xl sm:text-4xl font-black text-blackberry-color mb-6">My Bookings</h1>
            <nav className="flex flex-wrap gap-4 sm:gap-8">
               <button
                  onClick={() => toggleOpen("incomingBookings")}
                  className={`px-4 py-2 text-base sm:text-xl font-semibold transition-all duration-200 rounded-lg ${
                     open.incomingBookings
                        ? "bg-blue-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
               >
                  Incoming Bookings
               </button>
               <button
                  onClick={() => toggleOpen("ongoingBookings")}
                  className={`px-4 py-2 text-base sm:text-xl font-semibold transition-all duration-200 rounded-lg ${
                     open.ongoingBookings
                        ? "bg-green-color text-white shadow-lg"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-color"
                  }`}
               >
                  Ongoing Bookings
               </button>
               <button
                  onClick={() => toggleOpen("previousBookings")}
                  className={`px-4 py-2 text-base sm:text-xl font-semibold transition-all duration-200 rounded-lg ${
                     open.previousBookings
                        ? "bg-gray-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-600"
                  }`}
               >
                  Previous Bookings
               </button>
            </nav>
         </div>

         <section className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {open.incomingBookings && (
               <div className="space-y-4">
                  {sortedBookings.filter(b => b.status === "incoming").length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No incoming bookings</p>
                     </div>
                  ) : (
                     sortedBookings.map((book) => (
                        <BookingCard
                           key={book.id}
                           bookingStatus="incoming"
                           {...book}
                        />
                     ))
                  )}
               </div>
            )}

            {open.ongoingBookings && (
               <div className="space-y-4">
                  {sortedBookings.filter(b => b.status === "ongoing").length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No ongoing bookings</p>
                     </div>
                  ) : (
                     sortedBookings.map((book) => (
                        <BookingCard
                           key={book.id}
                           bookingStatus="ongoing"
                           {...book}
                        />
                     ))
                  )}
               </div>
            )}

            {open.previousBookings && (
               <div className="space-y-4">
                  {sortedBookings.filter(b => b.status === "previous").length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-xl text-gray-500">No previous bookings</p>
                     </div>
                  ) : (
                     sortedBookings.map((book) => (
                        <BookingCard
                           key={book.id}
                           bookingStatus="previous"
                           {...book}
                        />
                     ))
                  )}
               </div>
            )}
         </section>
      </section>
   );
};

export default MyBookings;
