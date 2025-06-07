import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import appLogo from "../assets/applogo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { LockClosedIcon, MobileIcon, PersonIcon } from "@radix-ui/react-icons";

const RegisterPage = () => {
   const { register } = useAuth();
   const [googleLogin, setGoogleLogin] = useState(false);
   const [loading, setLoading] = useState(false);
   const [sameUsername, setSameUsername] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
   const [credentials, setCredentials] = useState({
      password: "",
      username: "",
   });
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isError, setIsError] = useState(false);
   const [phoneNo, setPhoneNo] = useState();

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

   // const handleUsernameChange = async (username) => {
   //    try {
   //       console.log(username);
   //       const response = await axios.post(
   //          "http://localhost:8080/auth/verify_username",
   //          username,
   //          {
   //             headers: {
   //                "Content-Type": "application/json",
   //             },

   //          }
   //       );
   //       console.log(response.data);
   //    } catch (error) {
   //       console.log("Error verifying username : ", error);
   //    }
   // };

   const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (credentials.password === confirmPassword) {
         setLoading(true);
         const success = await register(credentials);
         if (success) {
            setLoading(false);
            navigate("/auth/login"); // Redirect after register
         } else {
            setSameUsername(true);
            setLoading(false);
         }
      } else {
         setIsError(true);
      }
   };

   const handleGoogleLogin = () => {
      window.location.href =
         "http://localhost:8080/oauth2/authorization/google";
      setGoogleLogin(true);
   };

   return (
      <div className="bg-white-color min-h-screen">
         <div className="grid grid-cols-1 md:grid-cols-2">
            <div className=" text-black mx-10 p-6 rounded-lg bg-white-color shadow-md transition-all">
               <h2 className="text-3xl font-bold text-green-color mb-1">
                  Create an account
               </h2>
               <p className="mb-4 text-gray-400 font-semibold ">
                  Join us and play with ease!
               </p>

               <form className="" onSubmit={handleSubmit}>
                  <div>
                     <label className="block mb-2 text-xl text-green-color">
                        Full Name
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <PersonIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="pl-10 outline-none border-2 border-sgreen-color/40 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type="text"
                           name="username"
                           placeholder="Enter your name"
                           onChange={handleChange}
                           onFocus={() => setSameUsername(false)}
                           required
                        />
                        {sameUsername && (
                           <p className="text-red-600">
                              Username already exist!
                           </p>
                        )}
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
                           className="pl-10 outline-none border-2 border-sgreen-color/40 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
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

                  <div className="mt-4">
                     <label className="block mb-2 text-xl text-green-color">
                        Confirm Password
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <LockClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="pl-10 outline-none border-2 border-sgreen-color/40 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type={showConfirmPassword ? "text" : "password"}
                           name="password"
                           placeholder="Confirm your password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           onFocus={() => setIsError(false)}
                           required
                        />
                        <button
                           type="button"
                           onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                           }
                        >
                           {showConfirmPassword ? (
                              <FaEyeSlash className="absolute right-4 top-3 " />
                           ) : (
                              <FaEye className="absolute right-4 top-3 " />
                           )}
                        </button>
                        {isError && (
                           <p className="text-red-500">Password is not same!</p>
                        )}
                     </div>
                  </div>

                  <div>
                     <div className="mt-4">
                        <label className="block mb-2 text-xl text-green-color">
                           Enter Phone No
                        </label>
                     </div>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <MobileIcon className="w-5 h-5" />
                        </p>
                        <input
                           className="pl-10 outline-none border-2 border-sgreen-color/40 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full"
                           type="number"
                           name="phone"
                           placeholder="+92"
                           value={phoneNo}
                           onChange={(e) => setPhoneNo(e.target.value)}
                           required
                        />
                     </div>
                  </div>

                  <button
                     className="w-full text-center px-1 py-2 bg-green-color text-white-color hover:bg-sgreen-color mt-4 cursor-pointer rounded transition-all font-semibold"
                     type="submit"
                     onClick={() => handleSubmit}
                  >
                     {loading ? (
                        <FaSpinner className="w-full animate-spin flex text-xl" />
                     ) : (
                        "Register"
                     )}
                  </button>
               </form>

               <div className="text-center my-4">
                  <button
                     className="bg-green-color hover:bg-sgreen-color text-white-color text-center p-4 rounded font-semibold"
                     onClick={handleGoogleLogin}
                  >
                     Sign in with Google
                  </button>
               </div>

               <Link className="flex justify-center text-green-color" to="/">
                  <img className="w-20" src={appLogo} />
               </Link>
            </div>
            <div className="text-balance flex flex-col gap-4 py-10 items-center">
               <img
                  src={appLogo}
                  className="h-32 w-32 rounded-full bg-white/90 p-2"
               />
               <p className="text-3xl font-semi-bold text-green-color text-center">
                  Find the court and book it just by one click!
               </p>
               <div className="flex gap-2">
                  <p className="bg-green-color px-4 py-1 rounded-full text-white">
                     100+ Courts
                  </p>
                  <p className="bg-green-color px-4 py-1 rounded-full text-white">
                     Secure Transactions
                  </p>
                  <p className="bg-green-color px-4 py-1 rounded-full text-white">
                     5000+ Users
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;
