import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensure accessibility

const BookingPopup = ({ isOpen, onClose, onConfirm, start, end, price }) => {
   const [formData, setFormData] = useState({
      name: "",
      contact: "",
      paymentMethod: "card",
   });

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      onConfirm(formData);
      onClose();
      setFormData({
         name: "",
         contact: "",
         paymentMethod: "card",
      });
   };

   return (
      <Modal
         isOpen={isOpen}
         onRequestClose={onClose}
         className="bg-white-color border-2 border-green-color text-black p-6 rounded-lg shadow-lg w-full mx-10 transition-all"
         overlayClassName="fixed inset-0 bg-black bg-white/10 backdrop-blur-sm flex items-center "
      >
         <div className="text-center text-2xl font-semibold border-b-2 border-green-color p-4 my-4">
            <div>
               {start} <span className="text-3xl font-black">-</span> {end}
            </div>
         </div>
         <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-10">
               <div>
                  <label className="block mb-2 text-xl">Name</label>
                  <input
                     type="text"
                     name="name"
                     placeholder="Enter your name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="bg-white text-black w-full p-2 border-2 border-green-color focus:outline-none focus:border-sgreen-color rounded"
                  />
               </div>

               <div>
                  <label className="block text-xl mb-2">Contact Number</label>
                  <input
                     type="text"
                     name="contact"
                     placeholder="+92"
                     value={formData.contact}
                     onChange={handleChange}
                     required
                     className="bg-white text-black w-full p-2 border-2 border-green-color focus:outline-none focus:border-sgreen-color  rounded"
                  />
               </div>
            </div>

            <label className="block mt-3 mb-2 text-xl font-semibold">
               Payment Method
            </label>
            <select
               name="paymentMethod"
               value={formData.paymentMethod}
               onChange={handleChange}
               className="bg-white text-black w-auto p-2 border-2 border-green-color focus:outline-none focus:border-sgreen-color rounded"
            >
               <option value="card">Credit/Debit Card</option>
               <option value="cash">Cash</option>
            </select>

            <h3 className="text-2xl text-center w-auto p-2">
               Final Amount : <span className="font-semibold">{price}/-</span>
            </h3>

            <div className="flex justify-between mt-4">
               <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 font-semibold text-black px-4 py-2 rounded transition-all"
                  onClick={onClose}
               >
                  Cancel
               </button>
               <button
                  type="submit"
                  className="bg-green-color text-white hover:bg-sgreen-color font-semibold hover:text-black px-4 py-2 rounded transition-all"
               >
                  Confirm Booking
               </button>
            </div>
         </form>
      </Modal>
   );
};

export default BookingPopup;
