import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../contexts/Context";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import dayjs from "dayjs";
import { DateTime } from "luxon";
import { format, addMinutes, isAfter, parse } from "date-fns";

const SlotsPage = () => {
   const { day, id, date } = useParams();
   const { courts } = useContext(AppContext);

   const { getOneWeek } = useContext(AppContext);
   const [timingsForDay, setTimingsForDay] = useState([]);
   const [bookingTime, setBookingTime] = useState();
   const [bookingDay, setBookingDay] = useState();
   const [bookingDate, setBookingDate] = useState();
   const [bookedSlots, setBookedSlots] = useState({
      day: day || "",
      date: date || "",
      endTime: "",
      startTime: "",
      status: "BOOKED",
      bookedTime: "",
      bookedDay: "",
      bookedDate: "",
   });

   const [booked, setBooked] = useState(false);
   const [allSlots, setAllSlots] = useState([]);
   const [bookedSlotStartTime, setBookedSlotStartTime] = useState([]);
   const [bookedSlotEndTime, setBookedSlotEndTime] = useState([]);
   const [priceCalc, setPriceCalc] = useState(0);
   const allTimeSlots = [
      "12:00 AM",
      "12:30 AM",
      "1:00 AM",
      "1:30 AM",
      "2:00 AM",
      "2:30 AM",
      "3:00 AM",
      "3:30 AM",
      "4:00 AM",
      "4:30 AM",
      "5:00 AM",
      "5:30 AM",
      "6:00 AM",
      "6:07 AM",
      "6:30 AM",
      "7:00 AM",
      "7:30 AM",
      "8:00 AM",
      "8:30 AM",
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
      "6:00 PM",
      "6:07 PM",
      "6:30 PM",
      "7:00 PM",
      "7:30 PM",
      "8:00 PM",
      "8:30 PM",
      "9:00 PM",
      "9:30 PM",
      "10:00 PM",
      "10:30 PM",
      "11:00 PM",
      "11:30 PM",
   ];

   const [availableSlots, setAvailableSlots] = useState([]);

   const court = courts.find((court) => court.id == id);
   console.log(court?.pricePerHour || "Price not available");

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

   const formatStartTime = timingsForDay.startingTime
      ? formatTime(timingsForDay.startingTime)
      : "N/A";

   const formatEndTime = timingsForDay.endingTime
      ? formatTime(timingsForDay.endingTime)
      : "N/A";

   useEffect(() => {
      const startIndex = allTimeSlots.indexOf(formatStartTime);
      const endIndex = allTimeSlots.indexOf(formatEndTime);

      console.log(startIndex);
      console.log(endIndex);

      if (startIndex !== -1 && endIndex !== -1) {
         setAvailableSlots(
            endIndex > startIndex
               ? allTimeSlots.slice(startIndex, endIndex + 1)
               : [
                    ...allTimeSlots.slice(startIndex),
                    ...allTimeSlots.slice(0, endIndex + 1),
                 ] // Handles overnight cases
         );
      }
   }, [formatStartTime, formatEndTime]);

   useEffect(() => {
      const fetchTimingsByDay = async () => {
         try {
            const response = await axios.get(
               `http://localhost:8080/court/${id}/timings/${day}`
            );
            setTimingsForDay(response.data);
         } catch (error) {
            console.log(`Error fetching Timings for ${day} : ${error}`);
         }
      };
      fetchTimingsByDay();
   }, [id]);

   const fetchBookedSlotsByDay = async () => {
      try {
         const response = await axios.get(
            `http://localhost:8080/court/${id}/${day}/booked_slots`
         );
         setAllSlots(response.data);
      } catch (error) {
         console.log(`Error fetching slots for ${day} - ${date} : ${error}`);
      }
   };

   useEffect(() => {
      fetchBookedSlotsByDay();
   }, []);

   useEffect(() => {
      if (allSlots) {
         const starts = allSlots.map((slot) => formatTime(slot.startTime));
         const ends = allSlots.map((slot) => formatTime(slot.endTime));
         setBookedSlotStartTime(starts);
         setBookedSlotEndTime(ends);
      }
   }, [allSlots]);

   useEffect(() => {
      if (bookingTime) {
         console.log("Updated bookingTime:", bookingTime);
         setBookedSlots((prevSlots) => ({
            ...prevSlots,
            bookedTime: bookingTime,
         }));
      }
      if (bookingDay) {
         console.log("Updated bookingDay:", bookingDay);
         setBookedSlots((prevSlots) => ({
            ...prevSlots,
            bookedDay: bookingDay,
         }));
      }
      if (bookingDate) {
         console.log("Updated bookingDate:", bookingDate);
         setBookedSlots((prevSlots) => ({
            ...prevSlots,
            bookedDate: bookingDate,
         }));
      }
   }, [bookingTime, bookingDate, bookingDay]);

   useEffect(() => {
      console.log("AJEEB SCN : ", bookedSlots.bookedTime);
      console.log("Condition Met! Saving...");

      if (bookedSlots.startTime && bookedSlots.endTime && booked) {
         axios.post(
            `http://localhost:8080/court/${id}/${day}/book`,
            bookedSlots,
            {
               headers: { "Content-Type": "application/json" },
            }
         );
         alert("Booked! We'll see you there.");
         fetchBookedSlotsByDay();
         setBooked(false);
         setBookedSlots({
            day: day || "",
            date: date || "",
            endTime: "",
            startTime: "",
            status: "BOOKED",
            bookedTime: "",
            bookedDay: "",
            bookedDate: "",
         });
      }
   }, [bookingTime]);

   useEffect(() => {
      console.log(bookedSlots);
   }, [bookedSlots]);

   const handleSlotChange = (e) => {
      const { name, value } = e.target;

      const parseTime = parse(value, "h:mm a", new Date());
      const formattedTime = format(parseTime, "HH:mm:ss ");
      console.log("Formatted Time:", formattedTime); // ✅ Check output
      setBookedSlots((prevSlots) => ({ ...prevSlots, [name]: formattedTime }));
      console.log(bookedSlots);

      const formattedStartTime = formatTime(bookedSlots.startTime);
      const formattedEndTime = formatTime(bookedSlots.endTime);
      const startingIndex = allTimeSlots.indexOf(formattedStartTime);
      const endingIndex = allTimeSlots.indexOf(formattedEndTime);
      const finalPrice =
         (court.pricePerHour * (endingIndex - startingIndex)) / 2;
      console.log(finalPrice);
      setPriceCalc(finalPrice);
   };

   const isBooked = (slot) => {
      return bookedSlotStartTime.some((start, idx) => {
         const end = bookedSlotEndTime[idx];
         const startIndex = availableSlots.indexOf(start);
         const endIndex = availableSlots.indexOf(end);

         // Ensure valid indices before checking range
         return (
            startIndex !== -1 &&
            endIndex !== -1 &&
            availableSlots.indexOf(slot) >= startIndex &&
            availableSlots.indexOf(slot) <= endIndex
         );
      });
   };

   const handleBookSlot = async () => {
      if (!bookedSlots.startTime || !bookedSlots.endTime) {
         alert("Please select a start and end time.");
         return;
      }

      if (bookedSlots.startTime === bookedSlots.endTime) {
         alert("Starting and ending time cannot be same!");
         return;
      }

      const formattedStartTime = formatTime(bookedSlots.startTime);
      const formattedEndTime = formatTime(bookedSlots.endTime);

      const startingIndex = availableSlots.indexOf(formattedStartTime);
      const endingIndex = availableSlots.indexOf(formattedEndTime);

      if (endingIndex < startingIndex) {
         alert("Wrong slot selection!");
         return;
      }

      // const bookStartTime = DateTime.fromFormat(
      //    bookedSlots.startTime,
      //    "HH:mm a"
      // );
      // const bookEndTime = DateTime.fromFormat(bookedSlots.endTime, "HH:mm a");

      // if (handleCondition(bookStartTime, bookEndTime)) {
      //    alert("Slot already Booked !!!");
      //    return;
      // }

      try {
         setBooked(true);
         const today = DateTime.now();
         const currentTime = today.toFormat("HH:mm:ss");
         const currentDay = today.toFormat("EEEE");
         const currentDate = today.toFormat("yyyy-MM-dd");
         setBookingTime(currentTime); // ✅ Update bookingTime first
         setBookingDate(currentDate);
         setBookingDay(currentDay);

         // setBookedSlots((prevSlots) => ({
         //    ...prevSlots,
         //    bookedTime: DateTime.now().toFormat("HH:mm:ss"),
         // }));
      } catch (error) {
         console.error(
            "Booking failed:",
            error.response?.data || error.message
         );
         alert("Booking failed. Please check your input.");
      }
   };

   return (
      <div className="bg-black text-white px-8 py-10 ">
         <div className=" mx-8 rounded shadow-xl  ">
            <div className="border-b-2   flex justify-center   font-bold  p-4">
               <h3 className="text-4xl">{day.toUpperCase()}</h3>
            </div>
            <div className="py-8">
               <div className=" flex justify-evenly">
                  <div>
                     <h4 className="text-2xl text-green-600 font-bold">
                        Opening time{" "}
                     </h4>
                     <p className="font-bold text-xl">{formatStartTime}</p>
                  </div>
                  <div>
                     <h4 className="text-2xl text-red-600 font-bold">
                        Closing time{" "}
                     </h4>
                     <p className="font-bold text-xl">{formatEndTime}</p>
                  </div>
               </div>
            </div>
         </div>

         <div className=" border-2  p-6 mx-8 mb-10  rounded shadow-xl">
            <h2 className="text-4xl font-bold p-4 text-center">Enter Slot</h2>
            <div className="grid grid-cols-2 place-items-center">
               <div>
                  <label htmlFor="startTime" className="mr-2">
                     Enter Starting Time
                  </label>
                  <select
                     defaultValue=""
                     name="startTime"
                     id="startTime"
                     onChange={handleSlotChange}
                     onFocus=""
                     className="bg-black p-2 border-2 border-green-400 focus:outline-none focus:border-blue-400 rounded"
                  >
                     <option value="" disabled hidden>
                        00:00
                     </option>
                     {availableSlots.map((slot) => (
                        <option
                           className="p-2  "
                           key={slot}
                           value={slot || ""}
                           disabled={isBooked(slot)}
                        >
                           {slot}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label htmlFor="endTime" className="mr-2">
                     Enter Ending Time
                  </label>
                  <select
                     defaultValue=""
                     name="endTime"
                     id="endTime"
                     onChange={handleSlotChange}
                     className="bg-black p-2 border-2 border-green-400 focus:outline-none focus:border-blue-400 "
                  >
                     <option value="" disabled hidden>
                        00:00
                     </option>
                     {availableSlots.map((slot) => {
                        return (
                           <option
                              className="p-2 "
                              key={slot}
                              value={slot || ""}
                              disabled={isBooked(slot)}
                           >
                              {slot}
                           </option>
                        );
                     })}
                  </select>
               </div>
            </div>
            <p className="mt-2  ">
               <span className=" font-bold">Note : </span> You can select
               timings only within the court&apos;s opening and closing hours.
               Additionally, already booked slots cannot be chosen.
            </p>
            <p>{priceCalc}</p>
            <div className="flex justify-center mt-6 ">
               <button
                  className="p-4 bg-green-500 hover:bg-green-600 w-40 h-14 text-black font-bold rounded transition-all"
                  onClick={handleBookSlot}
               >
                  Book Slot
               </button>
            </div>
         </div>

         <div className="px-8 mb-8">
            <h3 className="text-3xl font-bold text-center mb-6 border-b-2  p-4">
               {allSlots.length > 0
                  ? "Slots that are booked"
                  : "Ohoo! All slots are available"}
            </h3>
            <div>
               {allSlots.length > 0 && (
                  <div className="grid grid-cols-3 place-items-center p-4">
                     <h3 className="text-xl">Starting Time</h3>
                     <h3 className="text-xl">Ending Time</h3>
                     <h3 className="text-xl">Status</h3>
                  </div>
               )}
               <div
                  className={
                     allSlots.length == 0 ? "" : " border-2 border-green-400"
                  }
               >
                  {allSlots
                     ? allSlots.map((slot, index) => (
                          <div
                             className={
                                index == allSlots.length - 1
                                   ? "text-white  rounded grid grid-cols-3 "
                                   : "border-b-2 border-green-400 text-white  rounded grid grid-cols-3 "
                             }
                             key={index}
                          >
                             <div className="text-center p-4 border-r-2 border-green-400">
                                <p className="">{formatTime(slot.startTime)}</p>
                             </div>
                             <div className="text-center p-4 border-r-2 border-green-400">
                                <p className="">{formatTime(slot.endTime)}</p>
                             </div>
                             <div className="text-center p-4 ">
                                <p className="font-semibold text-red-500">
                                   {slot.status}
                                </p>
                             </div>
                          </div>
                       ))
                     : ""}
               </div>
            </div>
         </div>
      </div>
   );
};

export default SlotsPage;
