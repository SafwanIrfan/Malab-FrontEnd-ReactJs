import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AddCourtPage = () => {
   const navigate = useNavigate();
   const jwtToken = localStorage.getItem("token");
   const { id } = useParams();

   const [court, setCourt] = useState({
      name: "",
      description: "",
      pricePerHour: "",
      location: "",
   });
   const [oldImages, setOldImages] = useState([]);
   const [newImages, setNewImages] = useState([]);
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
         setCourt({
            id: data.id,
            name: data.name,
            description: data.description,
            pricePerHour: data.pricePerHour,
            location: data.location,
            imageUrls: data.imageUrls,
         });
         setTimings(data.timings); // Assuming backend sends timings array
         setOldImages(data.imageUrls || []); // Assuming backend sends image URLs
         console.log(data.imageUrls);
      } catch (error) {
         console.log("Error fetching court : ", error);
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

   const handleImageDelete = (indexToRemove) => {
      console.log(courtId);
      console.log("DELETE IMG : ", indexToRemove);
      // setSelectedImages((prevImages) =>
      //    prevImages.filter((_, index) => index !== indexToRemove)
      const confirm = window.confirm(
         "Are you sure you want to permenantly delete this picture?"
      );
      if (confirm) {
         try {
            axios.delete(
               `http://localhost:8080/court/${courtId}/image/${indexToRemove}`,
               {
                  headers: {
                     Authorization: `Bearer ${jwtToken}`,
                  },
               }
            );
            navigate(`/court/${id}/edit`);
            toast.success("Image removed successfully.");
         } catch (error) {
            console.log("Error deleting image : ", error);
            toast.error("Failed to delete image.");
         }
      }
   };

   const handleSubmit = async (e) => {
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
         console.log("Court", court);
         // 1️⃣ Save Court (without images)
         await axios.put(`http://localhost:8080/court/${id}/edit`, court, {
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
               formData.append("files", img);
            });

            await axios.post(
               `http://localhost:8080/court/${courtId}/addImage`,
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
            `http://localhost:8080/court/${courtId}/add_timings`,
            timings,
            {
               headers: {
                  Authorization: `Bearer ${jwtToken}`,
                  "Content-Type": "application/json",
               },
            }
         );

         setLoading(false);
         alert("Court added successfully!");
         setCourt({
            name: "",
            description: "",
            location: "",
            pricePerHour: "",
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

         setOldImages([]);
         navigate("/");
      } catch (error) {
         setLoading(false);
         console.error("Error adding court:", error);
      }
   };

   return (
      <div className="p-8 w-auto mx-auto text-black space-y-4">
         <h2 className="text-4xl font-black  border-b-2 border-green-color text-center p-4">
            Add Court
         </h2>
         <div>
            <div className="pt-4 grid grid-cols-2 gap-6">
               {/* Court Name Input */}
               <div>
                  <label
                     htmlFor="name"
                     className="mb-2 block text-xl font-medium"
                  >
                     <span className="text-red-500">*</span> Court Name
                  </label>
                  <input
                     type="text"
                     name="name"
                     id="name"
                     value={court.name}
                     onChange={handleInputChange}
                     className="w-full p-2 rounded-md text-black focus:outline-none border-2 border-green-color focus:border-sgreen-color"
                     placeholder="Enter court name"
                     required
                  />
               </div>

               <div>
                  <label
                     htmlFor="description"
                     className="mb-2 text-xl block  font-medium"
                  >
                     <span className="text-red-500">*</span> Court Description
                  </label>
                  <input
                     name="description"
                     id="description"
                     value={court.description}
                     onChange={handleInputChange}
                     className="w-full p-2  focus:outline-none border-2 border-green-color focus:border-sgreen-color rounded-md text-black"
                     placeholder="Enter court description"
                     required
                  />
               </div>

               <div>
                  <label
                     htmlFor="pricePerHour"
                     className="text-xl block mb-2 font-medium"
                  >
                     <span className="text-red-500">*</span> Price per hour
                  </label>
                  <input
                     type="number"
                     name="pricePerHour"
                     id="pricePerHour"
                     value={court.pricePerHour}
                     onChange={handleInputChange}
                     className="w-full p-2  focus:outline-none border-2 border-green-color focus:border-sgreen-color rounded-md text-black"
                     placeholder="Enter court price/hour"
                     required
                  />
               </div>

               <div>
                  <label
                     htmlFor="location"
                     className="text-xl block mb-2 font-medium"
                  >
                     <span className="text-red-500">*</span> Court Location
                  </label>
                  <input
                     type="text"
                     name="location"
                     id="location"
                     value={court.location}
                     onChange={handleInputChange}
                     className="w-full p-2  focus:outline-none border-2 border-green-color focus:border-sgreen-color rounded-md text-black"
                     placeholder="Enter court location"
                     required
                  />
               </div>

               <div>
                  <label
                     htmlFor="images"
                     className="block text-xl mb-2 font-medium"
                  >
                     Upload Images
                  </label>
                  <input
                     type="file"
                     id="images"
                     onChange={handleImageChange}
                     multiple
                     className="w-60 cursor-pointer"
                     accept="image/*"
                  />

                  {oldImages.length == 0 && newImages.length == 0 ? (
                     <p className="py-2 text-red-600">
                        Note: Uploading no images result in bad impression
                     </p>
                  ) : (
                     <div className="flex gap-4 mt-2">
                        {oldImages.map((image, index) => (
                           <div key={index} className="relative">
                              <button
                                 onClick={() =>
                                    handleImageDelete(court.imageUrls[index].id)
                                 }
                                 className="absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:text-lg transition-all"
                              >
                                 <FaTrash />
                              </button>
                              <img
                                 className="border-2 border-black object-cover cursor-pointer w-24 h-24"
                                 src={image.url}
                                 onClick={() =>
                                    window.open(image.url, "_blank")
                                 }
                              ></img>
                           </div>
                        ))}
                        <div className="flex gap-4">
                           {newImages.map((file, index) => (
                              <div
                                 key={index}
                                 className=" relative  inline-block"
                              >
                                 <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Selected ${index}`}
                                    onClick={() =>
                                       window.open(
                                          URL.createObjectURL(file),
                                          "_blank"
                                       )
                                    }
                                    className="w-24 h-24 object-cover cursor-pointer border-2 shadow-lg border-green-color transition-all"
                                 />
                                 <p className="absolute  text-red-600 font-bold rounded-full p-2 text-xs transition-all">
                                    Not saved yet
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-10">
               <h4 className="text-xl mb-2 font-medium">
                  {" "}
                  <span className="text-red-500">*</span> Add Timings
               </h4>
               <div className="border-2 rounded border-green-color">
                  {timings.map((timing, index) => (
                     <div
                        className={
                           index < timings.length - 1
                              ? "grid grid-cols-3 place-items-center p-4 border-b-2 border-green-color"
                              : "grid grid-cols-3 place-items-center p-4"
                        }
                        key={index}
                     >
                        <h3 className="text-green-color font-black text-xl">
                           {timing.day}
                        </h3>

                        <div className=" flex p-2">
                           <label
                              className="mr-2 py-2"
                              htmlFor={`startingTime-${index}`}
                           >
                              Opening Time :{" "}
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
                              className=" p-2 border-2 border-green-color focus:outline-none focus:border-sgreen-color rounded"
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
                           {/* <input
                              type="time"
                              id={`startingTime-${index}`}
                              value={timing.startingTime}
                              onChange={(e) =>
                                 handleTimingsChange(
                                    index,
                                    "startingTime",
                                    e.target.value
                                 )
                              }
                              className=" p-2  focus:outline-none border-2 border-green-color focus:border-sgreen-color rounded-md text-black"
                              placeholder="Enter starting time :"
                              required
                           /> */}
                        </div>
                        <div className="flex p-2">
                           <label
                              className="mr-2 py-2"
                              htmlFor={`endingTime-${index}`}
                           >
                              Closing Time :{" "}
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
                              className="p-2 border-2 border-green-color focus:outline-none focus:border-sgreen-color rounded"
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
               onClick={handleSubmit}
               type="submit"
               className="w-full text-xl font-bold mt-6 bg-green-500  p-4 rounded-md hover:bg-green-600 text-black transition-all"
               disabled={loading}
            >
               {loading ? "Submitting..." : "Save Court"}
            </button>
         </div>
      </div>
   );
};

export default AddCourtPage;
