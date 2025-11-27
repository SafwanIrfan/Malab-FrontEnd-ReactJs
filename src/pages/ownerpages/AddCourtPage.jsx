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
   const [timings, setTimings] = useState([
      { day: "Monday", startingTime: "", endingTime: "" },
      { day: "Tuesday", startingTime: "", endingTime: "" },
      { day: "Wednesday", startingTime: "", endingTime: "" },
      { day: "Thursday", startingTime: "", endingTime: "" },
      { day: "Friday", startingTime: "", endingTime: "" },
      { day: "Saturday", startingTime: "", endingTime: "" },
      { day: "Sunday", startingTime: "", endingTime: "" },
   ]);

   const courtInputClassName =
      "w-full px-4 py-2 rounded-md text-black focus:outline-none border-[1px] hover:border-blackberry-color focus:border-blackberry-color transition-all";

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCourt((prevCourt) => ({
         ...prevCourt,
         [name]: value,
      }));
   };

   const formatTimings = (arrayOfTimings) => {
      arrayOfTimings.map((timing) => {
         const parseStartTime = parse(
            timing.startingTime,
            "h:mm a",
            new Date()
         );
         timing.startingTime = format(parseStartTime, "HH:mm:ss");
         const parseEndTime = parse(timing.endingTime, "h:mm a", new Date());
         timing.endingTime = format(parseEndTime, "HH:mm:ss");
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
            if (timing.startingTime === timing.endingTime) {
               alert(`Opening and closing cannot be same at ${timing.day}`);
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

         formatTimings(timings);
         await axios.post(
            `http://localhost:8080/owner/court/${courtId}/add_timings`,
            timings,
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         setLoading(false);
         alert("Court added successfully!");
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
      <div className="p-8 w-auto mx-auto text-black  shadow-md space-y-4">
         <h2 className="text-4xl font-black font-serif border-b-2 border-blackberry-color text-center p-4">
            Add My Court
         </h2>
         <form onSubmit={submitHandler}>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
               {/* Court Name Input */}
               <div>
                  <label className="mb-2 block text-xl font-serif">
                     <span className="text-red-500">*</span> Court Name
                  </label>
                  <input
                     name="courtName"
                     type="text"
                     id="name"
                     value={court.courtName}
                     onChange={handleInputChange}
                     className={courtInputClassName}
                     placeholder="Enter court name"
                     required
                  />
               </div>

               <div>
                  <label className="mb-2 text-xl block font-serif">
                     <span className="text-red-500">*</span> Court Description
                  </label>
                  <input
                     name="description"
                     id="description"
                     value={court.description}
                     onChange={handleInputChange}
                     className={courtInputClassName}
                     placeholder="Enter court description"
                     required
                  />
               </div>

               <div>
                  <label className="text-xl block mb-2 font-serif">
                     <span className="text-red-500">*</span> Price per hour
                  </label>
                  <input
                     name="pricePerHour"
                     type="number"
                     id="pricePerHour"
                     value={court.pricePerHour}
                     onChange={handleInputChange}
                     className={courtInputClassName}
                     placeholder="Enter court price/hour"
                     required
                     onWheel={(e) => e.target.blur()} // for not +1 and -1 on scrolling on input field
                  />
                  {error.pricePerHour && (
                     <p className="text-red-500">Price cannot be negative</p>
                  )}
               </div>

               <div>
                  <label className="text-xl block mb-2 font-serif">
                     <span className="text-red-500">* </span>City
                  </label>{" "}
                  <select
                     name="city"
                     value={court.city}
                     onChange={handleCityChange}
                     className={courtInputClassName}
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
                  <label className="text-xl block mb-2 font-serif">
                     <span className="text-red-500">* </span>Area
                  </label>{" "}
                  <select
                     name="area"
                     value={court.area}
                     onChange={handleInputChange}
                     className={courtInputClassName}
                     required
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
                  <label className="text-xl block mb-2 font-serif">
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

               <div className="flex flex-col gap-1">
                  <label className="block text-xl mb-2 font-serif">
                     Upload Images
                  </label>
                  <input
                     type="file"
                     id="courtImages"
                     maxLength={5}
                     minLength={1}
                     onChange={(e) => handleCourtImageChange(e)}
                     accept="image/*"
                     style={{ display: "none" }}
                     multiple
                  />
                  <label
                     htmlFor="courtImages"
                     className="bg-white  rounded-md  border-[1px] hover:border-blackberry-color cursor-pointer px-4 py-2  transition-all "
                  >
                     Upload Court Images
                  </label>
                  <p className=" font-semibold">
                     You can add upto 5 images and size less than 240kb
                  </p>

                  {selectedCourtImages?.length > 0 && (
                     <div>
                        {selectedCourtImages?.map((file, index) => (
                           <div
                              key={index}
                              className="relative inline-block m-2"
                           >
                              <img
                                 src={URL.createObjectURL(file)}
                                 alt={`Selected ${index}`}
                                 className="w-20 h-20 object-cover border-[1px] shadow-lg border-blackberry-color"
                              />
                              <button
                                 type="button"
                                 onClick={() => handleRemoveCourtImage(index)}
                                 className="bg-white hover:bg-white-color absolute -top-1 -right-1  rounded-full p-1 transition-all"
                              >
                                 <Cross2Icon className="text-red-600 font-bold size-4" />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-6">
               <h4 className="text-2xl font-serif mb-4 ">
                  {" "}
                  <span className="text-red-500">*</span> Add Timings
               </h4>
               <div className="border-[1px] border-blackberry-color rounded">
                  {timings.map((timing, index) => (
                     <div
                        className={
                           index < timings.length - 1
                              ? "grid grid-cols-1 sm:grid-cols-3 sm:place-items-center p-4 border-b-[1px] border-blackberry-color"
                              : "grid grid-cols-1 sm:grid-cols-3 sm:place-items-center p-4"
                        }
                        key={index}
                     >
                        <div className="font-serif  sm:block">
                           <h1 className="mr-4 text-black font-serif text-xl h-4">
                              {timing.day}
                           </h1>
                           <div className="flex mt-2 ">
                              <p>Same as</p>
                              <select
                                 defaultValue={timing.day}
                                 onChange={(e) =>
                                    handleCopyTiming(timing.day, e.target.value)
                                 }
                                 className="bg-transparent hover:underline cursor-pointer focus:outline-none  rounded "
                              >
                                 <option disabled>Select day</option>
                                 {timings.map((days, index) => (
                                    <option
                                       disabled={timing.day === days.day}
                                       key={index}
                                    >
                                       {days.day}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </div>

                        <div className=" flex p-2">
                           <label className="mr-2 py-2 font-serif">
                              Opening Time :{" "}
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
                              className="p-1 sm:p-2 border-[1px] focus:outline-none hover:border-blackberry-color focus:border-blackberry-color rounded transition-all"
                           >
                              <option value="" disabled hidden>
                                 00:00
                              </option>
                              {allTimeSlots.map((slot) => (
                                 <option
                                    className="p-2  "
                                    key={slot}
                                    value={slot || ""}
                                 >
                                    {slot}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div className="flex p-2">
                           <label className="mr-2 py-2 font-serif">
                              Closing Time :{" "}
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
                              className="p-1 sm:p-2 border-[1px] focus:outline-none hover:border-blackberry-color focus:border-blackberry-color rounded transition-all"
                           >
                              <option value="" disabled hidden>
                                 00:00
                              </option>
                              {allTimeSlots.map((slot) => (
                                 <option
                                    className="p-2  "
                                    key={slot}
                                    value={slot || ""}
                                 >
                                    {slot}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* File Upload Input */}

            {/* Submit Button */}
            <button
               type="submit"
               className="w-full text-xl font-bold mt-6 bg-green-color text-white p-4 rounded-md hover:bg-sgreen-color hover:text-black transition-all"
            >
               {loading ? "Submitting..." : "ADD COURT"}
            </button>
         </form>
      </div>
   );
};

export default AddCourtPage;
