import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import appLogo from "../assets/applogo.svg";
import dummyicon from "../assets/dummyicon.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
   ArrowRightIcon,
   LockClosedIcon,
   PersonIcon,
} from "@radix-ui/react-icons";

const LoginPage = () => {
   const [loading, setLoading] = useState(false);
   const [googleLogin, setGoogleLogin] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [credentials, setCredentials] = useState({
      username: "",
      password: "",
   });

   const navigate = useNavigate();

   // useEffect(() => {
   //    const jwtToken = localStorage.getItem("token");
   //    if (jwtToken) {
   //       navigate("/");
   //    }
   // }, []);

   const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const fetchUser = async (username) => {
      try {
         const userResponse = await axios.get(
            `http://localhost:8080/auth/user/${username}`
         );
         console.log(userResponse);
         console.log(userResponse.data);
         return userResponse.data;
      } catch (error) {
         return error;
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await axios.post(
            "http://localhost:8080/auth/login",
            credentials,
            {
               withCredentials: true,
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );
         const userData = await fetchUser(credentials.username);
         const isUserValid = userData?.isVerified;
         if (isUserValid) {
            navigate("/"); // Redirect after login
            toast.success("Successfully Logged In!");
            setLoading(false);
            const jwtToken = response.data;
            localStorage.setItem("token", jwtToken);
            localStorage.setItem("user", JSON.stringify(credentials.username));
         } else {
            // user is not valid
            toast.error("Please validate your account first!");
            setLoading(false);
         }
      } catch (error) {
         // user has no account
         toast.error("Invalid username or password");
         setLoading(false);
         console.log(error);
      }
   };

   const handleGoogleLogin = () => {
      window.location.href =
         "http://localhost:8080/oauth2/authorization/google";
      setGoogleLogin(true);
   };

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

   return (
      <div>
         <Link className="flex py-4 px-8 justify-start text-green-color" to="/">
            <img className="w-16 h-16 sm:w-max" src={dummyicon} />
         </Link>
         <div className="flex justify-center items-center my-10 px-8 ">
            <div className=" text-black  p-6 rounded-lg bg-white shadow-2xl transition-all">
               <h2 className="text-2xl font-black mb-1  text-green-color">
                  LOGIN
               </h2>
               <p className="mb-4 text-gray-400 font-semibold ">
                  Just few steps ahead to start your journey!
               </p>

               <form className="" onSubmit={handleSubmit}>
                  <div>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <PersonIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="px-10 outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/80 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type="text"
                           name="username"
                           autoComplete="off"
                           placeholder="Username or Email Address"
                           onChange={handleChange}
                           required
                        />
                     </div>
                  </div>

                  <div className="mt-4">
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <LockClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="px-10 outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/80 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type={showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Password"
                           onChange={handleChange}
                           required
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((prev) => !prev)}
                        >
                           {showPassword ? (
                              <FaEyeSlash className="absolute right-4 top-3 " />
                           ) : (
                              <FaEye className="absolute right-4 top-3 " />
                           )}
                        </button>
                        <div className="mt-2 flex justify-between">
                           <div className="flex gap-2">
                              <input
                                 className="mt-[4px] w-4 h-4 accent-blue-500 border border-blue-500 rounded hover:border-blue-700"
                                 type="checkbox"
                                 name="KeepMeSignedIn"
                              />
                              <label>Keep me signed in</label>
                           </div>
                           <Link className="text-red-500 hover:text-red-700 text-md transition-all">
                              Forgot password?
                           </Link>
                        </div>
                     </div>
                  </div>

                  <button
                     type="submit"
                     className="text-center w-full px-1 py-2 bg-green-color text-white-color hover:bg-sgreen-color mt-6 cursor-pointer rounded transition-all"
                     onClick={() => handleSubmit}
                  >
                     {loading ? (
                        <FaSpinner className="w-full animate-spin text-xl" />
                     ) : (
                        "Login"
                     )}
                  </button>

                  <div className="flex gap-2 mt-4 items-center justify-between">
                     <p className="font-serif">Not have an account? </p>
                     <button
                        onClick={() => navigate("/auth/register")}
                        className="group flex bg-white font-semibold items-center gap-2 py-1 px-6 border-[1.5px] border-black rounded"
                     >
                        Register Now
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 duration-200 transition-all" />
                     </button>
                  </div>
               </form>

               {/* <div className="text-center my-4">
                  <button
                     className="bg-green-color hover:bg-sgreen-color text-white-color text-center p-4 rounded font-semibold  transition-all"
                     onClick={handleGoogleLogin}
                  >
                     Sign in with Google
                  </button>
               </div> */}
            </div>
         </div>
      </div>
   );
};

export default LoginPage;
