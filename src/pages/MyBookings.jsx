import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { useParams } from "react-router-dom";

const MyBookings = () => {
   const [bookings, setBookings] = useState([]);
   const { usersId } = useParams();

   const [open, setOpen] = useState({
      incomingBookings: false,
      ongoingBookings: false,
      previousBookings: false,
   });

   const today = new Date();
   const dateString = today.toISOString().split("T")[0];
   console.log(dateString);

   const startTimeString = `${dateString}T13:00:00`;
   const endTimeString = `${dateString}T14:00:00`;

   console.log(startTimeString);

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
            console.log(response.data);
            setBookings(response.data);
         } catch (error) {
            console.log("Error fetching bookings of user : ", error);
         }
      };
      fetchSlotsByUsersId();
   }, []);

   useEffect(() => {
      setOpen(false);
   }, []);

   const toggleOpen = (property) => {
      setOpen((prev) => ({
         ...prev,
         [property]: !prev[property],
      }));
   };

   return (
      <section>
         <section className="text-balance px-8 py-10">
            <div className="flex flex-col">
               <div
                  className={
                     open.incomingBookings
                        ? "flex gap-2 border-b-2 pb-4 transition-all"
                        : "flex gap-2 transition-all "
                  }
               >
                  <h2 className="text-xl font-semibold">Incoming bookings</h2>
                  <button
                     className=" bg-green-color/90 hover:bg-green-color mt-1/2 p-2 rounded-full transition-all"
                     onClick={() => toggleOpen("incomingBookings")}
                  >
                     <FaArrowDown
                        className={
                           open.incomingBookings
                              ? "text-white text-sm rotate-180 transition-all"
                              : "text-white text-sm transition-all"
                        }
                     />
                  </button>
               </div>
            </div>
         </section>

         <section className="text-balance px-8 py-10">
            <div className="flex flex-col">
               <div
                  className={
                     open.ongoingBookings
                        ? "flex gap-2 border-b-2 pb-4 transition-all"
                        : "flex gap-2 transition-all "
                  }
               >
                  <h2 className="text-xl font-semibold">Ongoing bookings</h2>
                  <button
                     className="bg-green-color/90 hover:bg-green-color mt-1/2 p-2 rounded-full transition-all"
                     onClick={() => toggleOpen("ongoingBookings")}
                  >
                     <FaArrowDown
                        className={
                           open.ongoingBookings
                              ? "text-white text-sm rotate-180 transition-all"
                              : "text-white text-sm transition-all"
                        }
                     />
                  </button>
               </div>
               {open.ongoingBookings && (
                  <div className="transition-all">
                     {bookings.map((book) => (
                        <ul key={book.id}>
                           <li className="text-black transition-all">
                              {book.day}
                           </li>
                        </ul>
                     ))}
                  </div>
               )}
            </div>
         </section>

         <section className="text-balance px-8 py-10">
            <div className="flex flex-col">
               <div
                  className={
                     open.previousBookings
                        ? "flex gap-2 border-b-2 pb-4 transition-all"
                        : "flex gap-2 transition-all "
                  }
               >
                  <h2 className="text-xl font-semibold">Previous bookings</h2>
                  <button
                     className=" bg-green-color/90 hover:bg-green-color mt-1/2 p-2 rounded-full transition-all"
                     onClick={() => toggleOpen("previousBookings")}
                  >
                     <FaArrowDown
                        className={
                           open.previousBookings
                              ? "text-white text-sm rotate-180 transition-all"
                              : "text-white text-sm transition-all"
                        }
                     />
                  </button>
               </div>
            </div>
         </section>
      </section>
   );
};

export default MyBookings;
