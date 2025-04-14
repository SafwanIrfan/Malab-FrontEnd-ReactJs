import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

const RegisterPage = () => {
   const { register } = useAuth();
   const [googleLogin, setGoogleLogin] = useState(false);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const [credentials, setCredentials] = useState({
      password: "",
      username: "",
   });

   useEffect(() => {
      if (googleLogin) {
         try {
            axios.get("http://localhost:8080/auth/callback", {
               withCredentials: true,
            });
            setGoogleLogin(false);
         } catch (error) {
            console.log("ERROR SCN : ", error);
            setGoogleLogin(false);
         }
      }
   }, [googleLogin]);

   const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const success = await register(credentials);
      if (success) {
         setLoading(false);
         navigate("/auth/login"); // Redirect after register
      } else {
         alert("Fill out all the fields");
         setLoading(false);
      }
   };

   const handleGoogleLogin = () => {
      window.location.href =
         "http://localhost:8080/oauth2/authorization/google";
      setGoogleLogin(true);
   };

   return (
      <div className="">
         <p className="font-semibold text-3xl text-white text-center pt-10">
            MAL<span className="text-green-500 text-3xl">ع</span>
            AB
         </p>
         <h3 className="pt-2 text-3xl font-semibold text-center text-green-500 ">
            Book your slots Digitally.
         </h3>

         <div className="flex justify-center items-center my-10">
            <div className="bg-green-400 w-96 border-4  p-6 rounded-lg">
               <h2 className="text-3xl font-semibold mb-4 text-center">
                  Login
               </h2>
               <form className="" onSubmit={handleSubmit}>
                  <div>
                     <label className="block mb-2 text-xl">Username</label>
                     <input
                        className="focus:outline-none bg-gray-200 focus:bg-white focus:shadow-2xl  p-2 rounded w-full "
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                     />
                  </div>
                  <div className="mt-4">
                     <label className="block mb-2 text-xl">Password</label>
                     <input
                        className="focus:outline-none bg-gray-200 focus:bg-white focus:shadow-2xl  p-2 rounded w-full "
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                     />
                  </div>
                  <div className="text-center px-1 py-2 bg-black text-green-400 hover:text-green-600 mt-4 cursor-pointer rounded transition-all">
                     <button className="font-semibold" type="submit">
                        {loading ? (
                           <FaSpinner className={"animate-spin text-xl"} />
                        ) : (
                           "Register"
                        )}
                     </button>
                  </div>
               </form>
               <div className="text-center my-4">
                  <button
                     className="bg-black hover:text-green-500 text-green-400 text-center p-4 rounded font-semibold"
                     onClick={handleGoogleLogin}
                  >
                     Sign in with Google
                  </button>
               </div>
               <Link className="text-center font-bold" to="/">
                  <p>
                     MAL<span className=" text-3xl">ع</span>
                     AB
                  </p>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;
