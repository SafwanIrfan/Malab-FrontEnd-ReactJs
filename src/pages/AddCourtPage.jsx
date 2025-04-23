import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const AddCourtPage = () => {
   const navigate = useNavigate();

   const jwtToken = localStorage.getItem("token");

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
      console.log(selectedImages);
   }, [selectedImages]);

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

      setSelectedImages((prev) => [...prev, ...files]);
   };

   const handleRemoveImage = (indexToRemove) => {
      setSelectedImages((prev) =>
         prev.filter((_, index) => index !== indexToRemove)
      );
   };

   // for (const file of files) {
   //    const formData = new FormData();
   //    formData.append("file", file);
   //    formData.append("upload_preset", "play_with_ease"); // 👈 Must match exactly
   //    formData.append("cloud_name", "dz95leiax"); // if using direct Cloudinary endpoint
   //    try {
   //       const response = await fetch(
   //          "https://api.cloudinary.com/v1_1/dz95leiax/image/upload",
   //          {
   //             method: "POST",
   //             body: formData,
   //          }
   //       );

   //       const data = await response.json();

   //       if (data.secure_url) {
   //          setSelectedImages((prev) => [...prev, data.secure_url]);
   //       } else {
   //          console.error("No secure_url returned:", data);
   //       }
   //    } catch (error) {
   //       console.error("Upload failed:", error);
   //    }
   // }

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
         const courtResponse = await axios.post(
            "http://localhost:8080/court/add",
            court,
            {
               headers: {
                  Authorization: `Bearer ${jwtToken}`,
               },
            }
         );
         const courtId = courtResponse.data.id;

         console.log(selectedImages);

         // 2️⃣ Upload Images (if selected)
         if (selectedImages.length > 0) {
            for (let image of selectedImages) {
               const formData = new FormData();
               formData.append("file", image);

               await axios.post(
                  `http://localhost:8080/court/${courtId}/addImage`,
                  formData,

                  {
                     headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${jwtToken}`,
                     },
                  }
               );
            }
         }
         console.log("Timings : ", timings);

         await axios.post(
            `http://localhost:8080/court/${courtId}/add_timings`,
            timings,
            {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${jwtToken}`,
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

         setSelectedImages([]);
         navigate("/");
      } catch (error) {
         setLoading(false);
         console.error("Error adding court:", error);
      }
   };

   return (
      <div className="p-8 w-auto mx-auto text-black  shadow-md space-y-4">
         <h2 className="text-4xl font-black border-b-2 border-green-color text-center p-4">
            Add Court
         </h2>
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
                     onChange={(e) => handleImageChange(e)}
                     multiple
                     className=""
                     accept="image/*"
                  />

                  {selectedImages.length == 0 ? (
                     <p className="py-2 text-red-600">
                        Note: Uploading no images result in bad impression
                     </p>
                  ) : (
                     <div>
                        {selectedImages.map((file, index) => (
                           <div
                              key={index}
                              className="relative inline-block m-2"
                           >
                              <img
                                 src={URL.createObjectURL(file)}
                                 alt={`Selected ${index}`}
                                 className="w-28 h-28 object-cover border-2 shadow-lg border-green-color"
                              />
                              <button
                                 onClick={() => handleRemoveImage(index)}
                                 className="absolute top-0 right-0 bg-black  text-red-600 rounded-full p-2 text-xs hover:text-sm transition-all"
                              >
                                 <FaTrash />
                              </button>
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
               <div className="border-2 border-green-color rounded">
                  {timings.map((timing, index) => (
                     <div
                        className={
                           index < timings.length - 1
                              ? "grid grid-cols-3 place-items-center p-4 border-b-2 border-sgreen-color"
                              : "grid grid-cols-3 place-items-center p-4"
                        }
                        key={index}
                     >
                        <h3 className="text-black font-semibold text-xl">
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
                              defaultValue=""
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
                              defaultValue=""
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
               type="submit"
               className="w-full text-xl font-bold mt-6 bg-green-color text-white p-4 rounded-md hover:bg-sgreen-color hover:text-black transition-all"
               disabled={loading}
            >
               {loading ? "Submitting..." : "ADD COURT"}
            </button>
         </form>
      </div>
   );
};

export default AddCourtPage;
