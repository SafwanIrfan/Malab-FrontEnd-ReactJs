import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import locationData from "../../data.json";
import { allTimeSlots } from "../../constants";
import { getDecodedToken, getToken } from "../../utils/authToken";
import { Cross2Icon } from "@radix-ui/react-icons";

const AddCourtPage = () => {
   const navigate = useNavigate();
   const token = getToken();
   const decodedToken = getDecodedToken();

   const [error, setError] = useState(false);
   const [errorMessage, setErrorMessage] = useState(false);

   const [court, setCourt] = useState({
      courtName: "",
      description: "",
      pricePerHour: "",
      city: "",
      area: "",
      totalBookings: 0,
   });
   const [selectedCourtImages, setSelectedCourtImages] = useState([]);
   const [cities, setCities] = useState([]);
   const [areas, setAreas] = useState([]);
   const [loading, setLoading] = useState(false);

   // Check if form has any data to enable submit button
   const hasFormData = () => {
      const hasCourtData = court.courtName.trim() !== "" ||
         court.description.trim() !== "" ||
         court.pricePerHour !== "" ||
         court.city !== "" ||
         court.area !== "";
      
      const hasTimings = timings.some(t => t.startingTime !== "" || t.endingTime !== "");
      const hasImages = selectedCourtImages.length > 0;

      return hasCourtData || hasTimings || hasImages;
   };
   const [timings, setTimings] = useState([
      { day: "Monday", startingTime: "", endingTime: "" },
      { day: "Tuesday", startingTime: "", endingTime: "" },
      { day: "Wednesday", startingTime: "", endingTime: "" },
      { day: "Thursday", startingTime: "", endingTime: "" },
      { day: "Friday", startingTime: "", endingTime: "" },
      { day: "Saturday", startingTime: "", endingTime: "" },
      { day: "Sunday", startingTime: "", endingTime: "" },
   ]);


   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCourt((prevCourt) => ({
         ...prevCourt,
         [name]: value,
      }));
   };

   const formatTimings = (arrayOfTimings) => {
      return arrayOfTimings.map((timing) => {
         if (timing.startingTime) {
            try {
               const parseStartTime = parse(
                  timing.startingTime,
                  "h:mm a",
                  new Date()
               );
               timing.startingTime = format(parseStartTime, "HH:mm:ss");
            } catch (error) {
               console.error("Error parsing starting time:", error);
            }
         }
         if (timing.endingTime) {
            try {
               const parseEndTime = parse(timing.endingTime, "h:mm a", new Date());
               timing.endingTime = format(parseEndTime, "HH:mm:ss");
            } catch (error) {
               console.error("Error parsing ending time:", error);
            }
         }
         return timing;
      });
   };

   const handleTimingsChange = (index, field, value) => {
      setTimings((prevTimings) => {
         const updatedTimings = [...prevTimings];
         updatedTimings[index] = {
            ...updatedTimings[index],
            [field]: value,
         };
         return updatedTimings;
      });
      console.log(value);
   };

   const handleCopyTiming = (targetDay, sourceDay) => {
      const source = timings.find((t) => t.day === sourceDay);
      if (!source) return;
      console.log(source.startingTime);
      setTimings((prev) =>
         prev.map((t) =>
            t.day === targetDay
               ? {
                    ...t,
                    startingTime: source.startingTime,
                    endingTime: source.endingTime,
                 }
               : t
         )
      );
   };

   const handleCourtImageChange = (e) => {
      console.log(Array.from(e.target.files));
      const files = Array.from(e.target.files);
      setSelectedCourtImages((prev) => [...prev, ...files]);

      // Clear file input to allow re-selecting the same file
      e.target.value = "";
   };

   useEffect(() => {
      console.log(selectedCourtImages);
   }, [selectedCourtImages]);

   const handleRemoveCourtImage = (indexToRemove) => {
      setSelectedCourtImages((prev) =>
         prev.filter((_, index) => index !== indexToRemove)
      );
   };

   const submitHandler = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log("Final Court Data: ", { ...court, timings });
      try {
         for (let timing of timings) {
            if (timing.startingTime && timing.endingTime && timing.startingTime === timing.endingTime) {
               toast.error(`Opening and closing time cannot be same on ${timing.day}`);
               setLoading(false);
               return;
            }
         }
         court.pricePerHour = Number(court.pricePerHour);

         if (error.courtName || error.pricePerHour) {
            toast.error("Failed to add court. Check your inputs!");
            setLoading(false);
            return;
         }

         // Save Court (without images)
         const courtResponse = await axios.post(
            `http://localhost:8080/owner/${decodedToken.sub}/court/add`,
            court,
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         const courtId = courtResponse.data.id;

         console.log(selectedCourtImages);

         const formData = new FormData();

         // Append multiple court images
         selectedCourtImages.forEach((image) => {
            formData.append("courtFiles", image); // append multiple files with the same key
         });

         await axios.post(
            `http://localhost:8080/owner/court/${courtId}/addImage`,
            formData,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         console.log("Timings : ", timings);

         const formattedTimings = formatTimings([...timings]);
         await axios.post(
            `http://localhost:8080/owner/court/${courtId}/add_timings`,
            formattedTimings,
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setLoading(false);
         toast.success("Court added successfully!");
         setCourt({
            courtName: "",
            description: "",
            pricePerHour: "",
            city: "",
            area: "",
            totalBookings: 0,
         });
         setTimings([
            { day: "Monday", startingTime: "", endingTime: "" },
            { day: "Tuesday", startingTime: "", endingTime: "" },
            { day: "Wednesday", startingTime: "", endingTime: "" },
            { day: "Thursday", startingTime: "", endingTime: "" },
            { day: "Friday", startingTime: "", endingTime: "" },
            { day: "Saturday", startingTime: "", endingTime: "" },
            { day: "Sunday", startingTime: "", endingTime: "" },
         ]);

         setSelectedCourtImages([]);

         navigate("/owner/dashboard");
      } catch (error) {
         setLoading(false);
         console.error("Error adding court:", error);
         toast.error("Failed to add court. Please try again.");
      }
   };

   useEffect(() => {
      const cityNames = Object.keys(locationData.Pakistan);
      setCities(cityNames);
   }, []);

   const handleCityChange = (e) => {
      const city = e.target.value;

      setCourt((prevCourt) => ({
         ...prevCourt,
         city: city,
         area: "",
      }));
      setAreas(locationData.Pakistan[city] || []);
   };

   return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-6xl mx-auto text-black">
         <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-blackberry-color border-b-2 border-green-color text-center pb-4 mb-6">
               Add My Court
            </h2>
         </div>
         <div className="bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={submitHandler} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Court Name Input */}
               <div>
                  <label className="mb-2 block text-lg sm:text-xl font-semibold text-green-color">
                     <span className="text-red-500">*</span> Court Name
                  </label>
                  <input
                     name="courtName"
                     type="text"
                     id="courtName"
                     value={court.courtName}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     placeholder="Enter court name"
                     required
                  />
               </div>

               <div>
                  <label className="mb-2 block text-lg sm:text-xl font-semibold text-green-color">
                     <span className="text-red-500">*</span> Court Description
                  </label>
                  <textarea
                     name="description"
                     id="description"
                     value={court.description}
                     onChange={handleInputChange}
                     rows="3"
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50 resize-none"
                     placeholder="Enter court description"
                     required
                  />
               </div>

               <div>
                  <label className="mb-2 block text-lg sm:text-xl font-semibold text-green-color">
                     <span className="text-red-500">*</span> Price per hour
                  </label>
                  <input
                     name="pricePerHour"
                     type="number"
                     id="pricePerHour"
                     value={court.pricePerHour}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     placeholder="Enter price per hour (Rs)"
                     required
                     onWheel={(e) => e.target.blur()}
                     min="0"
                  />
                  {error.pricePerHour && (
                     <p className="mt-1 text-sm text-red-500">Price cannot be negative</p>
                  )}
               </div>

               <div>
                  <label className="mb-2 block text-lg sm:text-xl font-semibold text-green-color">
                     <span className="text-red-500">*</span> City
                  </label>
                  <select
                     name="city"
                     value={court.city}
                     onChange={handleCityChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     required
                  >
                     <option value="">-- Select City --</option>
                     {cities.map((city) => (
                        <option key={city} value={city}>
                           {city}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="mb-2 block text-lg sm:text-xl font-semibold text-green-color">
                     <span className="text-red-500">*</span> Area
                  </label>
                  <select
                     name="area"
                     value={court.area}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     required
                     disabled={!court.city}
                  >
                     {!court.city ? (
                        <option value="">
                           -- Please select a city first --
                        </option>
                     ) : (
                        <>
                           <option value="">-- Select Area --</option>
                           {areas.map((area) => (
                              <option key={area} value={area}>
                                 {area}
                              </option>
                           ))}
                        </>
                     )}
                  </select>
               </div>

               {/* <div>
                  <label className="text-xl block mb-2 ">
                     <span className="text-red-500">*</span> Court Location
                  </label>
                  <input
                     type="text"
                     id="location"
                     value={court.location}
                     onChange={handleInputChange}
                     className={courtInputClassName}
                     placeholder="Enter court location"
                     required
                  />
               </div> */}

               <div className="md:col-span-2">
                  <label className="block text-lg sm:text-xl mb-3 font-semibold text-green-color">
                     Upload Images
                  </label>
                  <input
                     type="file"
                     id="courtImages"
                     onChange={(e) => handleCourtImageChange(e)}
                     accept="image/*"
                     style={{ display: "none" }}
                     multiple
                     disabled={selectedCourtImages.length >= 5}
                  />
                  <label
                     htmlFor="courtImages"
                     className={`inline-block px-4 py-2 rounded-xl cursor-pointer border-2 transition-all ${
                        selectedCourtImages.length >= 5
                           ? "border-gray-300 text-gray-400 cursor-not-allowed"
                           : "border-sgreen-color/40 hover:border-sgreen-color/60 bg-white-color/50 hover:bg-white-color"
                     }`}
                  >
                     {selectedCourtImages.length >= 5 ? "Maximum 5 images" : "Upload Court Images"}
                  </label>
                  <p className="mt-2 text-sm text-gray-600">
                     You can add up to 5 images (size less than 240kb)
                  </p>

                  {selectedCourtImages?.length > 0 && (
                     <div className="flex flex-wrap gap-4 mt-4">
                        {selectedCourtImages?.map((file, index) => (
                           <div
                              key={index}
                              className="relative group"
                           >
                              <img
                                 src={URL.createObjectURL(file)}
                                 alt={`Selected ${index + 1}`}
                                 className="w-24 h-24 sm:w-32 sm:h-32 object-cover border-2 border-blackberry-color rounded-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                                 onClick={() => window.open(URL.createObjectURL(file), "_blank")}
                              />
                              <button
                                 type="button"
                                 onClick={() => handleRemoveCourtImage(index)}
                                 className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all z-10"
                                 aria-label="Remove image"
                              >
                                 <Cross2Icon className="w-3 h-3" />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-8">
               <h4 className="text-xl sm:text-2xl mb-4 font-semibold text-blackberry-color">
                  <span className="text-red-500">*</span> Court Timings
               </h4>
               <div className="border-2 border-blackberry-color rounded-xl overflow-hidden">
                  {timings.map((timing, index) => (
                     <div
                        className={
                           index < timings.length - 1
                              ? "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 border-b-2 border-blackberry-color bg-white/50 hover:bg-white/70 transition-colors"
                              : "grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6 bg-white/50 hover:bg-white/70 transition-colors"
                        }
                        key={index}
                     >
                        <div className="flex flex-col gap-2">
                           <h3 className="text-green-color font-black text-lg sm:text-xl">
                              {timing.day}
                           </h3>
                           <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">Same as:</span>
                              <select
                                 defaultValue={timing.day}
                                 onChange={(e) =>
                                    handleCopyTiming(timing.day, e.target.value)
                                 }
                                 className="bg-transparent hover:underline cursor-pointer focus:outline-none rounded border-0 text-green-color font-medium"
                              >
                                 <option disabled>Select day</option>
                                 {timings.map((days, idx) => (
                                    <option
                                       disabled={timing.day === days.day}
                                       key={idx}
                                    >
                                       {days.day}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                           <label
                              className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap"
                              htmlFor={`startingTime-${index}`}
                           >
                              Opening Time:
                           </label>
                           <select
                              value={timing.startingTime}
                              name="startingTime"
                              id={`startingTime-${index}`}
                              onChange={(e) =>
                                 handleTimingsChange(
                                    index,
                                    "startingTime",
                                    e.target.value
                                 )
                              }
                              className="w-full sm:w-auto px-4 py-2 border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 rounded-xl transition-all bg-white"
                           >
                              <option value="" disabled hidden>
                                 Select time
                              </option>
                              {allTimeSlots.map((slot) => (
                                 <option key={slot} value={slot || ""}>
                                    {slot}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                           <label
                              className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap"
                              htmlFor={`endingTime-${index}`}
                           >
                              Closing Time:
                           </label>
                           <select
                              value={timing.endingTime}
                              name="endingTime"
                              id={`endingTime-${index}`}
                              onChange={(e) =>
                                 handleTimingsChange(
                                    index,
                                    "endingTime",
                                    e.target.value
                                 )
                              }
                              className="w-full sm:w-auto px-4 py-2 border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 rounded-xl transition-all bg-white"
                           >
                              <option value="" disabled hidden>
                                 Select time
                              </option>
                              {allTimeSlots.map((slot) => (
                                 <option key={slot} value={slot || ""}>
                                    {slot}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t-2 border-gray-200">
               <button
                  onClick={(e) => {
                     e.preventDefault();
                     navigate("/owner/dashboard");
                  }}
                  type="button"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  disabled={loading || !hasFormData()}
                  className="flex-1 px-6 sm:px-8 py-3 font-semibold border-2 border-blackberry-color text-white bg-green-color hover:bg-sgreen-color hover:text-black transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-green-color disabled:hover:text-white"
                  title={!hasFormData() ? "Please fill in at least one field" : ""}
               >
                  {loading ? (
                     <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                     </span>
                  ) : (
                     "Add Court"
                  )}
               </button>
            </div>
            </form>
         </div>
      </div>
   );
};

export default AddCourtPage;
