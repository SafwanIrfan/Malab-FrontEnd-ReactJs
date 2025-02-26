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

                  <p className="py-2 text-red-600">
                     Note: Uploading no images result in bad impression
                  </p>
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
                              className=" p-2  focus:outline-none border-2 border-green-400 focus:border-blue-400 rounded-md text-black"
                              placeholder="Enter starting time :"
                              required
                           />
                        </div>
                        <div className="flex p-2">
                           <label
                              className="mr-2 py-2"
                              htmlFor={`endingTime-${index}`}
                           >
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
                              className=" p-2  focus:outline-none border-2 border-green-400 focus:border-blue-400 rounded-md text-black"
                              placeholder="Enter ending time :"
                              required
                           />
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
