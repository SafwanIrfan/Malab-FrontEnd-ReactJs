import React, { useState } from "react";
import axios from "axios";

const AddCourtPage = () => {
   const [court, setCourt] = useState({
      name: "",
      description: "",
      pricePerHour: "",
      location: "",
   });
   const [selectedImages, setSelectedImages] = useState(null);
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
   const [daysCount, setDaysCount] = useState(0);
   const [errorMessage, setErrorMessage] = useState("");

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCourt((prevCourt) => ({
         ...prevCourt,
         [name]: value,
      }));
   };

   const handleTimingsChange = (index, field, value) => {
      setTimings((prevTimings) => {
         const updatedTimings = [...prevTimings];
         updatedTimings[index] = { ...updatedTimings[index], [field]: value };
         return updatedTimings;
      });
   };

   const handleImageChange = (e) => {
      setSelectedImages([...e.target.files]);
   };

   const submitHandler = async (e) => {
      e.preventDefault();
      setLoading(true);
      console.log("Final Court Data: ", { ...court, timings });
      try {
         court.pricePerHour = Number(court.pricePerHour);
         console.log("Court", court);
         // 1️⃣ Save Court (without images)
         const courtResponse = await axios.post(
            "http://localhost:8080/court/add",
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
      } catch (error) {
         setLoading(false);
         console.error("Error adding court:", error);
      }
   };

   return (
      <div className="p-8 w-auto mx-auto bg-white rounded-xl shadow-md space-y-4">
         <h2 className="text-2xl font-bold">Add Court</h2>
         <form onSubmit={submitHandler} className="space-y-4">
            {/* Court Name Input */}
            <div>
               <label htmlFor="name" className="block text-sm font-medium">
                  Court Name
               </label>
               <input
                  type="text"
                  name="name"
                  id="name"
                  value={court.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter court name"
                  required
               />
            </div>

            <div>
               <label
                  htmlFor="description"
                  className="block text-sm font-medium"
               >
                  Court Description
               </label>
               <input
                  name="description"
                  id="description"
                  value={court.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter court description"
                  required
               />
            </div>

            <div>
               <label
                  htmlFor="pricePerHour"
                  className="block text-sm font-medium"
               >
                  Price per hour
               </label>
               <input
                  type="number"
                  name="pricePerHour"
                  id="pricePerHour"
                  value={court.pricePerHour}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter court price/hour"
                  required
               />
            </div>

            <div>
               <label htmlFor="location" className="block text-sm font-medium">
                  Court Location
               </label>
               <input
                  type="text"
                  name="location"
                  id="location"
                  value={court.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter court location"
                  required
               />
            </div>

            <div>
               <h4 className="text-2xl text-bold">Add Timings</h4>
               {timings.map((timing, index) => (
                  <div className="flex justify-evenly p-2  " key={index}>
                     <div className="flex gap-2  p-2 w-36">
                        <label htmlFor={`day-${index}`}>Day : </label>
                        <h3>{timing.day}</h3>
                     </div>

                     <div className=" flex p-2">
                        <label
                           className="mr-2"
                           htmlFor={`startingTime-${index}`}
                        >
                           Opening Time :{" "}
                        </label>
                        <input
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
                           className=" p-2 border rounded-md"
                           placeholder="Enter starting time :"
                           required
                        />
                     </div>
                     <div className="flex p-2">
                        <label className="mr-2" htmlFor={`endingTime-${index}`}>
                           Closing Time :{" "}
                        </label>
                        <input
                           type="time"
                           id={`endingTime-${index}`}
                           value={timing.endingTime}
                           onChange={(e) =>
                              handleTimingsChange(
                                 index,
                                 "endingTime",
                                 e.target.value
                              )
                           }
                           className=" p-2 border rounded-md"
                           placeholder="Enter ending time :"
                           required
                        />
                     </div>
                  </div>
               ))}
            </div>

            {/* File Upload Input */}
            <div>
               <label htmlFor="images" className="block text-sm font-medium">
                  Upload Images
               </label>
               <input
                  type="file"
                  id="images"
                  onChange={handleImageChange}
                  multiple
                  className="w-full"
                  accept="image/*"
               />
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
               disabled={loading}
            >
               {loading ? "Submitting..." : "Add Court"}
            </button>
         </form>
      </div>
   );
};

export default AddCourtPage;
