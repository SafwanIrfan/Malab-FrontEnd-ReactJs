const Button = ({ title, action }) => {
   return (
      <button
         type="submit"
         onClick={action}
         className="px-6 py-4 font-semibold text-white bg-green-color hover:bg-sgreen-color hover:text-black transition-all rounded"
      >
         {title}
      </button>
   );
};

export default Button;
