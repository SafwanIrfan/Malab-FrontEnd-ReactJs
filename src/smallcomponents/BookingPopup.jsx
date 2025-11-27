import { useState } from "react";
import Modal from "react-modal";
import Button from "./Button";
import { Cross2Icon } from "@radix-ui/react-icons";

Modal.setAppElement("#root"); // Ensure accessibility

const BookingPopup = ({ isOpen, onClose, onConfirm, start, end, price }) => {
   const [formData, setFormData] = useState({
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
         paymentMethod: "card",
      });
   };

   return (
      <Modal
         isOpen={isOpen}
         onRequestClose={onClose}
         className="bg-white-color border-[2px] border-blackberry-color text-black p-6 rounded-lg shadow-lg w-full mx-10 transition-all"
         overlayClassName="fixed inset-0 bg-black bg-white/10 backdrop-blur-sm flex items-center "
      >
         <button className="absolute right-16" onClick={onClose}>
            <Cross2Icon className="size-8 hover:text-red-500 transition-all" />
         </button>
         <div className="text-center text-2xl font-semibold border-b-2 border-blackberry-color p-4 my-4">
            <div>
               {start} <span className="text-3xl font-black">-</span> {end}
            </div>
         </div>
         <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-10"></div>

            <label className="block mt-3 mb-2 text-xl font-semibold">
               Payment Method
            </label>
            <select
               name="paymentMethod"
               value={formData.paymentMethod}
               onChange={handleChange}
               className="bg-white text-black w-auto p-2 border-2 border-blackberry-color focus:outline-none  rounded"
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
                  className="bg-red-500 hover:bg-red-600 font-semibold text-white px-4 py-2 rounded transition-all"
                  onClick={onClose}
               >
                  Cancel
               </button>
               <Button action={handleSubmit} title="Confirm Booking" />
            </div>
         </form>
      </Modal>
   );
};

export default BookingPopup;
