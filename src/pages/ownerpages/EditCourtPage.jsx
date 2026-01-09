import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getToken } from "../../utils/authToken";

const AddCourtPage = () => {
   const navigate = useNavigate();
   const jwtToken = getToken();
   const { id } = useParams();

   const [court, setCourt] = useState({
      courtName: "",
      description: "",
      pricePerHour: "",
      area: "",
      city: "",
   });
   const [oldImages, setOldImages] = useState([]);
   const [newImages, setNewImages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [initialCourt, setInitialCourt] = useState(null);
   const [initialTimings, setInitialTimings] = useState(null);
   const [initialOldImages, setInitialOldImages] = useState([]);
   const [timings, setTimings] = useState([
      { day: "Monday", startingTime: "", endingTime: "" },
      { day: "Tuesday", startingTime: "", endingTime: "" },
      { day: "Wednesday", startingTime: "", endingTime: "" },
      { day: "Thursday", startingTime: "", endingTime: "" },
      { day: "Friday", startingTime: "", endingTime: "" },
      { day: "Saturday", startingTime: "", endingTime: "" },
      { day: "Sunday", startingTime: "", endingTime: "" },
   ]);
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

   useEffect(() => {
      console.log(oldImages);
   }, [oldImages]);

   const courtId = court.id;

   const fetchCourt = async () => {
      try {
         const response = await axios.get(`http://localhost:8080/court/${id}`, {
            headers: {
               Authorization: `Bearer ${jwtToken}`,
            },
         });

         const data = response.data;
         console.log(data);
         const courtData = {
            id: data.id,
            courtName: data.courtName || "",
            description: data.description || "",
            pricePerHour: data.pricePerHour || "",
            city: data.city || "",
            area: data.area || "",
            imageUrls: data.courtImageUrls || [],
         };
         const timingsData = data.timings || [
            { day: "Monday", startingTime: "", endingTime: "" },
            { day: "Tuesday", startingTime: "", endingTime: "" },
            { day: "Wednesday", startingTime: "", endingTime: "" },
            { day: "Thursday", startingTime: "", endingTime: "" },
            { day: "Friday", startingTime: "", endingTime: "" },
            { day: "Saturday", startingTime: "", endingTime: "" },
            { day: "Sunday", startingTime: "", endingTime: "" },
         ];
         const imagesData = data.courtImageUrls || [];
         
         setCourt(courtData);
         setTimings(timingsData);
         setOldImages(imagesData);
         
         // Store initial state for comparison
         setInitialCourt(courtData);
         setInitialTimings(JSON.parse(JSON.stringify(timingsData)));
         setInitialOldImages(JSON.parse(JSON.stringify(imagesData)));
      } catch (error) {
         console.log("Error fetching court : ", error);
         toast.error("Failed to load court details. Please try again.");
         navigate("/owner/dashboard");
      }
   };

   useEffect(() => {
      fetchCourt();
   }, []);

   const convertTo12Hr = (time) => {
      if (!time) return ""; // check if time is empty or null
      try {
         return format(parse(time, "HH:mm:ss", new Date()), "h:mm a"); // first format : coming input , second format : desired value
      } catch (error) {
         console.log("Invalid time value:", time, " Err :", error);
         return "";
      }
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCourt((prevCourt) => ({
         ...prevCourt,
         [name]: value,
      }));
   };

   const handleTimingsChange = (index, field, value) => {
      const parseTime = parse(value, "h:mm a", new Date());
      const formattedTime = format(parseTime, "HH:mm:ss ");
      setTimings((prevTimings) => {
         const updatedTimings = [...prevTimings];
         updatedTimings[index] = {
            ...updatedTimings[index],
            [field]: formattedTime,
         };
         return updatedTimings;
      });
      console.log(formattedTime);
   };

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setNewImages((prev) => [...prev, ...files]);
   };

   const handleImageDelete = async (imageId) => {
      if (!imageId) {
         toast.error("Image ID is missing");
         return;
      }
      if (window.confirm(
         "Are you sure you want to permanently delete this picture?"
      )) {
         try {
            await axios.delete(
               `http://localhost:8080/owner/court/${courtId}/image/${imageId}`,
               {
                  headers: {
                     Authorization: `Bearer ${jwtToken}`,
                  },
               }
            );
            toast.success("Image removed successfully.");
            // Refresh the court data
            fetchCourt();
         } catch (error) {
            console.log("Error deleting image : ", error);
            toast.error("Failed to delete image.");
         }
      }
   };

   // Check if form has changes
   const hasChanges = () => {
      if (!initialCourt || !initialTimings) return false;

      // Check court data changes
      const courtChanged = 
         court.courtName !== initialCourt.courtName ||
         court.description !== initialCourt.description ||
         String(court.pricePerHour) !== String(initialCourt.pricePerHour) ||
         court.city !== initialCourt.city ||
         court.area !== initialCourt.area;

      // Check timings changes - normalize both arrays for comparison
      const normalizeTimings = (timingsArray) => {
         return timingsArray.map(t => ({
            day: t.day,
            startingTime: t.startingTime || "",
            endingTime: t.endingTime || ""
         }));
      };
      const timingsChanged = JSON.stringify(normalizeTimings(timings)) !== 
                           JSON.stringify(normalizeTimings(initialTimings));

      // Check images changes (new images added or old images deleted)
      const getImageIds = (images) => images.map(img => img?.id).filter(id => id != null).sort();
      const imagesChanged = newImages.length > 0 || 
         JSON.stringify(getImageIds(oldImages)) !== JSON.stringify(getImageIds(initialOldImages));

      return courtChanged || timingsChanged || imagesChanged;
   };

   const handleSubmit = async (e) => {
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
         console.log("Court", court);
         // 1️⃣ Save Court (without images)
         await axios.put(`http://localhost:8080/owner/court/${id}/edit`, court, {
            headers: {
               Authorization: `Bearer ${jwtToken}`,
               "Content-Type": "application/json",
            },
         });
         // const courtId = courtResponse.data.id;

         // 2️⃣ Upload Images (if selected)
         if (newImages.length > 0) {
            const formData = new FormData();
            console.log(newImages);
            newImages.forEach((img) => {
               formData.append("courtFiles", img);
            });

            await axios.post(
               `http://localhost:8080/owner/court/${courtId}/addImage`,
               formData,
               {
                  headers: {
                     Authorization: `Bearer ${jwtToken}`,
                     "Content-Type": "multipart/form-data",
                  },
               }
            );
         }
         console.log("Timings : ", timings);

         await axios.post(
            `http://localhost:8080/owner/court/${courtId}/add_timings`,
            timings,
            {
               headers: {
                  Authorization: `Bearer ${jwtToken}`,
                  "Content-Type": "application/json",
               },
            }
         );

         setLoading(false);
         toast.success("Court updated successfully!");
         navigate("/owner/dashboard");
      } catch (error) {
         setLoading(false);
         console.error("Error updating court:", error);
         toast.error("Failed to update court. Please try again.");
      }
   };

   return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-6xl mx-auto text-black">
         <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-blackberry-color border-b-2 border-green-color text-center pb-4 mb-6">
               Edit Court
            </h2>
         </div>
         <div className="bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl p-6 sm:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Court Name Input */}
               <div>
                  <label
                     htmlFor="courtName"
                     className="mb-2 block text-lg sm:text-xl font-semibold text-green-color"
                  >
                     <span className="text-red-500">*</span> Court Name
                  </label>
                  <input
                     type="text"
                     name="courtName"
                     id="courtName"
                     value={court.courtName}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     placeholder="Enter court name"
                     required
                  />
               </div>

               <div>
                  <label
                     htmlFor="description"
                     className="mb-2 block text-lg sm:text-xl font-semibold text-green-color"
                  >
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
                  <label
                     htmlFor="pricePerHour"
                     className="mb-2 block text-lg sm:text-xl font-semibold text-green-color"
                  >
                     <span className="text-red-500">*</span> Price per hour
                  </label>
                  <input
                     type="number"
                     name="pricePerHour"
                     id="pricePerHour"
                     value={court.pricePerHour}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     placeholder="Enter price per hour (Rs)"
                     required
                  />
               </div>

               <div>
                  <label
                     htmlFor="city"
                     className="mb-2 block text-lg sm:text-xl font-semibold text-green-color"
                  >
                     <span className="text-red-500">*</span> City
                  </label>
                  <input
                     type="text"
                     name="city"
                     id="city"
                     value={court.city}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     placeholder="Enter city"
                     required
                  />
               </div>

               <div className="md:col-span-2">
                  <label
                     htmlFor="area"
                     className="mb-2 block text-lg sm:text-xl font-semibold text-green-color"
                  >
                     <span className="text-red-500">*</span> Area
                  </label>
                  <input
                     type="text"
                     name="area"
                     id="area"
                     value={court.area}
                     onChange={handleInputChange}
                     className="w-full px-4 py-3 rounded-xl text-black focus:outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50"
                     placeholder="Enter area"
                     required
                  />
               </div>

               <div className="md:col-span-2">
                  <label
                     htmlFor="images"
                     className="block text-lg sm:text-xl mb-3 font-semibold text-green-color"
                  >
                     Upload Images
                  </label>
                  <input
                     type="file"
                     id="images"
                     onChange={handleImageChange}
                     multiple
                     className="w-full sm:w-auto px-4 py-2 rounded-xl cursor-pointer border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 transition-all bg-white-color/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-color file:text-white file:cursor-pointer file:hover:bg-sgreen-color file:transition-all"
                     accept="image/*"
                  />

                  {oldImages.length == 0 && newImages.length == 0 ? (
                     <p className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 rounded-lg text-sm">
                        <strong>Note:</strong> Uploading no images may result in a bad impression for users
                     </p>
                  ) : (
                     <div className="flex flex-wrap gap-4 mt-4">
                        {oldImages.map((image, index) => (
                           <div key={image.id || index} className="relative group">
                              <button
                                 onClick={(e) => {
                                    e.preventDefault();
                                    handleImageDelete(image.id);
                                 }}
                                 className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all z-10"
                                 aria-label="Delete image"
                              >
                                 <FaTrash className="w-3 h-3" />
                              </button>
                              <img
                                 className="border-2 border-blackberry-color object-cover cursor-pointer w-24 h-24 sm:w-32 sm:h-32 rounded-lg hover:scale-105 transition-transform duration-200"
                                 src={image.url}
                                 alt={`Court image ${index + 1}`}
                                 onClick={() =>
                                    window.open(image.url, "_blank")
                                 }
                              />
                           </div>
                        ))}
                        {newImages.map((file, index) => (
                           <div
                              key={index}
                              className="relative group"
                           >
                              <img
                                 src={URL.createObjectURL(file)}
                                 alt={`New image ${index + 1}`}
                                 onClick={() =>
                                    window.open(
                                       URL.createObjectURL(file),
                                       "_blank"
                                    )
                                 }
                                 className="w-24 h-24 sm:w-32 sm:h-32 object-cover cursor-pointer border-2 border-green-color rounded-lg hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-green-color/90 text-white text-xs font-semibold py-1 px-2 rounded-b-lg">
                                 New
                              </div>
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
                        <div className="flex items-center">
                           <h3 className="text-green-color font-black text-lg sm:text-xl">
                              {timing.day}
                           </h3>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                           <label
                              className="text-sm sm:text-base font-medium text-gray-700 whitespace-nowrap"
                              htmlFor={`startingTime-${index}`}
                           >
                              Opening Time:
                           </label>
                           <select
                              value={convertTo12Hr(timing.startingTime)}
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
                              value={convertTo12Hr(timing.endingTime)}
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
                  disabled={loading || !hasChanges()}
                  className="flex-1 px-6 sm:px-8 py-3 font-semibold border-2 border-blackberry-color text-white bg-green-color hover:bg-sgreen-color hover:text-black transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-green-color disabled:hover:text-white"
                  title={!hasChanges() ? "No changes to save" : ""}
               >
                  {loading ? (
                     <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating...
                     </span>
                  ) : (
                     "Update Court"
                  )}
               </button>
            </div>
            </form>
         </div>
      </div>
   );
};

export default AddCourtPage;
