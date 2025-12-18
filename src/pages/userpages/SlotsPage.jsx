import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../contexts/Context";
import { useParams } from "react-router-dom";
import axios from "axios";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { DateTime } from "luxon";
import { format, parse } from "date-fns";
import BookingPopup from "../../smallcomponents/BookingPopup";
import Button from "../../smallcomponents/Button";
import { getToken } from "../../utils/authToken";
import { fetchCourtById } from "../../services/api";
import Loading from "../../smallcomponents/Loading";

const SlotsPage = () => {
   const { day, id, date } = useParams();
   const { courts, formatTime } = useContext(AppContext);

   const [isPopupOpen, setPopupOpen] = useState(false);

   const [timingsForDay, setTimingsForDay] = useState([]);
   const [bookedSlots, setBookedSlots] = useState({
      day: day || "",
      date: date || "",
      endTime: "",
      startTime: "",
      status: "BOOKED",
      bookedTime: "",
      bookedDay: "",
      bookedDate: "",
      courtName: "",
      amount: 0,
   });

   const [booked, setBooked] = useState(false);
   const [allSlots, setAllSlots] = useState([]);
   const [bookedSlotStartTime, setBookedSlotStartTime] = useState([]);
   const [bookedSlotEndTime, setBookedSlotEndTime] = useState([]);
   const [priceCalc, setPriceCalc] = useState(0);
   const [availableSlots, setAvailableSlots] = useState([]);

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

   const token = getToken();

   const { data: court, isLoading, error } = fetchCourtById(id, token);

   const formatStartTime = formatTime(timingsForDay.startingTime);

   const formatEndTime = formatTime(timingsForDay.endingTime);

   useEffect(() => {
      const startIndex = allTimeSlots.indexOf(formatStartTime);
      const endIndex = allTimeSlots.indexOf(formatEndTime);

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
               `http://localhost:8080/court/${id}/timings/${day}`,
               {
                  withCredentials: true,
                  headers: { Authorization: `Bearer ${token}` },
               }
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
            `http://localhost:8080/court/${id}/${day}/booked_slots`,
            {
               withCredentials: true,
               headers: { Authorization: `Bearer ${token}` },
            }
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

   const handleBookSlotSchedule = (key, value) => {
      console.log("KEY : ", key);
      setBookedSlots((prevSlots) => ({
         ...prevSlots,
         [key]: value,
      }));
   };

   // useEffect(() => {
   //    if (bookingTime) {
   //       console.log("Updated bookingTime:", bookingTime);
   //       setBookedSlots((prevSlots) => ({
   //          ...prevSlots,
   //          bookedTime: bookingTime,
   //       }));
   //    }
   //    if (bookingDay) {
   //       console.log("Updated bookingDay:", bookingDay);
   //       setBookedSlots((prevSlots) => ({
   //          ...prevSlots,
   //          bookedDay: bookingDay,
   //       }));
   //    }
   //    if (bookingDate) {
   //       console.log("Updated bookingDate:", bookingDate);
   //       setBookedSlots((prevSlots) => ({
   //          ...prevSlots,
   //          bookedDate: bookingDate,
   //       }));
   //    }
   // }, [bookingTime, bookingDate, bookingDay]);

   useEffect(() => {
      console.log("AJEEB SCN : ", bookedSlots.bookedTime);
      console.log("Condition Met! Saving...");

      if (booked) {
         axios
            .post(
               `http://localhost:8080/court/${id}/${day}/book`,
               bookedSlots,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                     "Content-Type": "application/json",
                  },
               }
            )
            .then((response) => {
               console.log("Booking Successful : ", response.data);
            })
            .catch((error) =>
               console.error(
                  "POST Failed:",
                  error.response?.data || error.message
               )
            );
         alert("Booked! We'll see you there.");
         fetchBookedSlotsByDay();
         setBooked(false);
         setBookedSlots({
            day: day || "",
            date: date || "",
            courtName: "",
            endTime: "",
            startTime: "",
            status: "BOOKED",
            bookedTime: "",
            bookedDay: "",
            bookedDate: "",
            amount: 0,
         });
      }
   }, [booked]);

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

      const finalPrice =
         (court.pricePerHour * (endingIndex - startingIndex)) / 2;
      console.log(finalPrice);
      setPriceCalc(finalPrice);
      setPopupOpen(true);
   };

   const handleTransaction = () => {
      setBooked(true);
      setBookedSlots((prev) => ({
         ...prev,
         courtName: court.name,
         amount: priceCalc,
      }));
      const today = DateTime.now();
      const currentTime = today.toFormat("HH:mm:ss");
      const currentDay = today.toFormat("EEEE");
      const currentDate = today.toFormat("yyyy-MM-dd");
      handleBookSlotSchedule("bookedTime", currentTime);
      handleBookSlotSchedule("bookedDay", currentDay);
      handleBookSlotSchedule("bookedDate", currentDate);
      // setBookingTime(currentTime); // ✅ Update bookingTime first
      // setBookingDate(currentDate);
      // setBookingDay(currentDay);
   };

   if (isLoading) return <Loading />;

   if (error)
      return (
         <div className="p-4 mt-20 flex justify-center items-center">
            <div className="px-4 py-8 flex flex-col  text-center  rounded text-balance ">
               <h1 className="text-5xl mb-2">OOPS!</h1>
               <p className="mb-4 text-xl">
                  Your session is expired. Please login
               </p>
            </div>
         </div>
      );

   return (
      <div className="text-black px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-6xl mx-auto">
         <div className="flex justify-center border-b-2 border-blackberry-color font-black py-3 mb-6">
            <h3 className="text-3xl sm:text-4xl text-blackberry-color">{day.toUpperCase()}</h3>
         </div>
         {formatStartTime != isNaN && formatEndTime != isNaN ? (
            <div>
               <div className="mb-8">
                  <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-12">
                     <div className="bg-gradient-to-br from-green-color to-sgreen-color p-6 rounded-xl shadow-lg text-white">
                        <h4 className="text-xl sm:text-2xl mb-2">
                           Opening Time
                        </h4>
                        <p className="font-bold text-2xl sm:text-3xl">{formatStartTime}</p>
                     </div>
                     <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
                        <h4 className="text-xl sm:text-2xl mb-2">
                           Closing Time
                        </h4>
                        <p className="font-bold text-2xl sm:text-3xl">
                           {formatEndTime ? formatEndTime : "CLOSED"}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="border-2 bg-white/90 backdrop-blur-sm border-blackberry-color px-6 sm:px-8 py-8 mb-10 rounded-2xl shadow-xl">
                  <h2 className="text-2xl sm:text-3xl mb-8 text-center text-blackberry-color">
                     Choose Your Slot
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label className="block mb-3 text-lg sm:text-xl text-gray-700">
                           Starting Time
                        </label>
                        <select
                           defaultValue=""
                           name="startTime"
                           id="startTime"
                           onChange={handleSlotChange}
                           className="w-full bg-white border-2 border-blackberry-color hover:border-green-color focus:border-green-color focus:ring-2 focus:ring-green-color/20 text-black p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                           <option value="" disabled hidden>
                              Select start time
                           </option>
                           {availableSlots.map((slot) => (
                              <option
                                 key={slot}
                                 value={slot || ""}
                                 disabled={isBooked(slot)}
                                 className={isBooked(slot) ? "text-gray-400" : ""}
                              >
                                 {slot} {isBooked(slot) && "(Booked)"}
                              </option>
                           ))}
                        </select>
                     </div>
                     <div>
                        <label className="block mb-3 text-lg sm:text-xl text-gray-700">
                           Ending Time
                        </label>
                        <select
                           defaultValue=""
                           name="endTime"
                           id="endTime"
                           onChange={handleSlotChange}
                           className="w-full bg-white border-2 border-blackberry-color hover:border-green-color focus:border-green-color focus:ring-2 focus:ring-green-color/20 text-black p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                           <option value="" disabled hidden>
                              Select end time
                           </option>
                           {availableSlots.map((slot) => {
                              return (
                                 <option
                                    key={slot}
                                    value={slot || ""}
                                    disabled={isBooked(slot)}
                                    className={isBooked(slot) ? "text-gray-400" : ""}
                                 >
                                    {slot} {isBooked(slot) && "(Booked)"}
                                 </option>
                              );
                           })}
                        </select>
                     </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
                     <p className="text-sm sm:text-base text-balance">
                        <span className="font-bold text-blue-700">Note: </span>
                        You can select timings only within the court&apos;s opening
                        and closing hours. Additionally, already booked slots
                        cannot be chosen.
                     </p>
                  </div>
                  <div className="flex justify-center mt-6">
                     <Button title="Book Slot" action={handleBookSlot} />
                  </div>
                  <BookingPopup
                     isOpen={isPopupOpen}
                     onClose={() => setPopupOpen(false)}
                     onConfirm={handleTransaction}
                     start={formatTime(bookedSlots.startTime)}
                     end={formatTime(bookedSlots.endTime)}
                     price={priceCalc}
                  />
               </div>
            </div>
         ) : (
            <div className="flex justify-center items-center py-20">
               <div className="text-center">
                  <p className="text-red-500 font-black text-balance p-4 text-4xl sm:text-5xl mb-4">
                     CLOSED
                  </p>
                  <p className="text-gray-600 text-lg">This court is closed on {day}</p>
               </div>
            </div>
         )}
      </div>
   );
};

export default SlotsPage;
