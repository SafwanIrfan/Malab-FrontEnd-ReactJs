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
   const [selectedImages, setSelectedImages] = useState([]);
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
      const fetchCourt = async () => {
         try {
            const response = await axios.get(
               `http://localhost:8080/court/${id}`,
               {
                  headers: {
                     Authorization: `Bearer ${jwtToken}`,
                  },
               }
            );

            const data = response.data;
            setCourt({
               name: data.name,
               description: data.description,
               pricePerHour: data.pricePerHour,
               location: data.location,
            });
            setTimings(data.timings); // Assuming backend sends timings array
            setSelectedImages(data.imageUrls || []); // Assuming backend sends image URLs
            console.log(data.imageUrls);
         } catch (error) {
            console.log("Error fetching court : ", error);
         }
      };
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
      setSelectedImages([...e.target.files]);
   };

   const handleImageDelete = (indexToRemove) => {
      const confirm = window.confirm("Do you want to delete this picture?");
      if (confirm) {
         setSelectedImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToRemove)
         );
         toast.success("Image removed successfully.");
      }
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
         console.log("Court", court);
         // 1️⃣ Save Court (without images)
         const courtResponse = await axios.put(
            `http://localhost:8080/court/${id}/edit`,
            court
         );
         const courtId = courtResponse.data.id;

         // 2️⃣ Upload Images (if selected)
         if (selectedImages.length > 0) {
            for (let image of selectedImages) {
               const formData = new FormData();
               formData.append("file", image);

               await axios.post(
                  `http://localhost:8080/court/${courtId}/addImage`,
                  formData,
                  {
                     headers: { "Content-Type": "multipart/form-data" },
                  }
               );
            }
         }
         console.log("Timings : ", timings);

         await axios.post(
            `http://localhost:8080/court/${courtId}/add_timings`,
            timings,
            { headers: { "Content-Type": "application/json" } }
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

         setSelectedImages([]);
         navigate("/");
      } catch (error) {
         setLoading(false);
         console.error("Error adding court:", error);
      }
   };

   return (
      <div className="p-8 w-auto mx-auto bg-black text-white  shadow-md space-y-4">
         <h2 className="text-4xl  border-b-2 text-center p-4">Add Court</h2>
         <form onSubmit={submitHandler}>
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
                     className="w-full p-2 rounded-md text-black focus:outline-none border-2 border-green-400 focus:border-blue-400"
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
                     className="w-full p-2  focus:outline-none border-2 border-green-400 focus:border-blue-400 rounded-md text-black"
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
                     className="w-full p-2  focus:outline-none border-2 border-green-400 focus:border-blue-400 rounded-md text-black"
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
                     className="w-full p-2  focus:outline-none border-2 border-green-400 focus:border-blue-400 rounded-md text-black"
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

                  {selectedImages.length == 0 ? (
                     <p className="py-2 text-red-600">
                        Note: Uploading no images result in bad impression
                     </p>
                  ) : (
                     <div className="flex gap-4 mt-2">
                        {selectedImages.map((image, index) => (
                           <div key={index} className="relative">
                              <button
                                 onClick={() => handleImageDelete(index)}
                                 className="absolute top-1 right-1 bg-red-400 rounded-full p-1 hover:bg-red-500 transition"
                              >
                                 <FaTrash />
                              </button>
                              <img
                                 className="border-2 cursor-pointer w-24 h-24"
                                 src={image}
                                 onClick={() => window.open(image, "_blank")}
                              ></img>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-6">
               <h4 className="text-2xl font-normal mb-4">
                  {" "}
                  <span className="text-red-500">*</span> Add Timings
               </h4>
               <div className="border-2 rounded">
                  {timings.map((timing, index) => (
                     <div
                        className={
                           index < timings.length - 1
                              ? "grid grid-cols-3 place-items-center p-4 border-b-2"
                              : "grid grid-cols-3 place-items-center p-4"
                        }
                        key={index}
                     >
                        <h3 className="text-green-400 text-xl">{timing.day}</h3>

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
                              className="bg-black p-2 border-2 border-green-400 focus:outline-none focus:border-blue-400 rounded"
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
                              className=" p-2  focus:outline-none border-2 border-green-400 focus:border-blue-400 rounded-md text-black"
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
                              className="bg-black p-2 border-2 border-green-400 focus:outline-none focus:border-blue-400 rounded"
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
               className="w-full text-xl font-bold mt-6 bg-green-500  p-4 rounded-md hover:bg-green-600 text-black transition-all"
               disabled={loading}
            >
               {loading ? "Submitting..." : "Add Court"}
            </button>
         </form>
      </div>
   );
};

export default AddCourtPage;
