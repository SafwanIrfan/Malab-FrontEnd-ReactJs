import { useNavigate } from "react-router-dom";

const Identification = () => {
   const navigate = useNavigate();

   return (
      <>
         <div className="font-sourGummy bg-black flex justify-center p-6">
            <p className="text-green-400 text-4xl">Play With Ease</p>
         </div>
         <div className="font-sans  ">
            <h1 className="text-center font-bold text-3xl mt-8">Register</h1>
            <div className="   flex justify-between p-8 m-6 mt-10 ">
               <div className="w-screen rounded p-6 border-2 border-black mr-4">
                  <h1 className="text-2xl">For checking booking/schedules</h1>
                  <p className="text-gray-600">
                     You can see which schedules are available based on your
                     timings.
                  </p>
                  <button
                     onClick={() => navigate("/user-signup")}
                     className="font-semibold rounded mt-6 p-3 bg-green-300 hover:bg-green-400"
                  >
                     SignUp
                  </button>
               </div>
               <div className="w-screen rounded p-6 border-2 border-black">
                  <h1 className="text-2xl">For your Business</h1>
                  <p className="text-gray-600">
                     Register your business and have a great journey.
                  </p>
                  <button
                     onClick={() => navigate("/business-signup")}
                     className="font-semibold rounded mt-6 p-3 bg-green-300 hover:bg-green-400"
                  >
                     SignUp
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default Identification;
