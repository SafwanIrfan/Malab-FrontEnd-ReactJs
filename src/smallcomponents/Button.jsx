const Button = ({ title, action, disabled = false }) => {
   return (
      <button
         type="button"
         onClick={action}
         disabled={disabled}
         className="px-6 sm:px-8 py-3 sm:py-4 font-semibold border-2 border-blackberry-color text-white bg-green-color hover:bg-sgreen-color hover:text-black transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
         {title}
      </button>
   );
};

export default Button;
