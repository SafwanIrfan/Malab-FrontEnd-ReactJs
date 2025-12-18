import Modal from "react-modal";
import { Cross2Icon } from "@radix-ui/react-icons";

Modal.setAppElement("#root"); // Ensure accessibility

const ConfirmationModal = ({
   isOpen,
   onClose,
   onConfirm,
   title = "Confirm Action",
   message = "Are you sure you want to proceed?",
   confirmText = "Confirm",
   cancelText = "Cancel",
   confirmButtonColor = "green-color",
   isDanger = false,
}) => {
   const handleConfirm = () => {
      onConfirm();
      onClose();
   };

   return (
      <Modal
         isOpen={isOpen}
         onRequestClose={onClose}
         className="bg-white border-2 border-blackberry-color text-black p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 transition-all"
         overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
         closeTimeoutMS={200}
      >
         <button
            className="absolute right-4 top-4 text-gray-400 hover:text-red-500 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
         >
            <Cross2Icon className="w-6 h-6" />
         </button>

         <div className="text-center">
            <div className="mb-4">
               {isDanger ? (
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                     <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                     </svg>
                  </div>
               ) : (
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                     <svg
                        className="w-8 h-8 text-green-color"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                     </svg>
                  </div>
               )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-blackberry-color mb-3">
               {title}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-6">{message}</p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
               <button
                  onClick={onClose}
                  className="px-6 py-2.5 font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 rounded-xl shadow-md hover:shadow-lg"
               >
                  {cancelText}
               </button>
               <button
                  onClick={handleConfirm}
                  className={`px-6 py-2.5 font-semibold text-white transition-all duration-200 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                     isDanger
                        ? "bg-red-500 hover:bg-red-600"
                        : confirmButtonColor === "green-color"
                        ? "bg-green-color hover:bg-sgreen-color hover:text-black"
                        : "bg-green-color hover:bg-sgreen-color hover:text-black"
                  }`}
               >
                  {confirmText}
               </button>
            </div>
         </div>
      </Modal>
   );
};

export default ConfirmationModal;

