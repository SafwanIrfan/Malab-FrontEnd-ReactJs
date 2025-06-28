import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import appLogo from "../assets/applogo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { LockClosedIcon, PersonIcon } from "@radix-ui/react-icons";

const LoginPage = () => {
   const { login } = useAuth();

   const [userDetails, setUserDetails] = useState();
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
      <div className="bg-white-color ">
         <div className="flex justify-center items-center my-10 px-8">
            <div className=" text-black w-96 p-6 rounded-lg bg-white shadow-2xl transition-all">
               <h2 className="text-3xl font-black mb-4  text-green-color">
                  Login
               </h2>
               <p className="mb-4 text-gray-400 font-semibold ">
                  Just few steps ahead to start your journey!
               </p>

               <form className="" onSubmit={handleSubmit}>
                  <div>
                     <label className="block mb-2 text-xl text-green-color">
                        Username
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <PersonIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="px-10 outline-none border-2 border-sgreen-color/40 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type="text"
                           name="username"
                           placeholder="Enter your name"
                           onChange={handleChange}
                           required
                        />
                     </div>
                  </div>

                  <div className="mt-4">
                     <label className="block mb-2 text-xl text-green-color">
                        Password
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <LockClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="px-10 outline-none border-2 border-sgreen-color/40 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type={showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Enter your password"
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
                     </div>
                  </div>

                  <button
                     type="submit"
                     className="text-center w-full px-1 py-2 bg-green-color text-white-color hover:bg-sgreen-color mt-4 cursor-pointer rounded transition-all"
                     onClick={() => handleSubmit}
                  >
                     {loading ? (
                        <FaSpinner className="w-full animate-spin text-xl" />
                     ) : (
                        "Login"
                     )}
                  </button>

                  <p className="text-center mt-2">
                     Not have an account?{" "}
                     <span className="text-sgreen-color hover:text-green-color font-semibold">
                        <Link to="/auth/register">Register</Link>
                     </span>
                  </p>
               </form>

               {/* <div className="text-center my-4">
                  <button
                     className="bg-green-color hover:bg-sgreen-color text-white-color text-center p-4 rounded font-semibold  transition-all"
                     onClick={handleGoogleLogin}
                  >
                     Sign in with Google
                  </button>
               </div> */}

               <Link
                  className="flex mt-2 justify-center text-green-color"
                  to="/"
               >
                  <img className="w-32 sm:w-max" src={appLogo} />
               </Link>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;
