import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import appLogo from "../assets/applogo.svg";
import dummyicon from "../assets/dummyicon.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
   ArrowRightIcon,
   CheckCircledIcon,
   EnvelopeClosedIcon,
   EnvelopeOpenIcon,
   LockClosedIcon,
   MobileIcon,
   PersonIcon,
} from "@radix-ui/react-icons";
import { toast } from "react-toastify";

const RegisterPage = () => {
   const [googleLogin, setGoogleLogin] = useState(false);
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();
   const [userData, setUserData] = useState({
      password: "",
      username: "",
      phoneNo: null,
      email: "",
      isVerified: false,
   });
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isError, setIsError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [emailSend, setEmailSend] = useState(false);

   useEffect(() => {
      if (googleLogin) {
         try {
            axios.get("http://localhost:8080/auth/callback", {
               withuserData: true,
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

   useEffect(() => {
      if (emailSend) {
         const verifySec = document.getElementById("verify");
         verifySec?.scrollIntoView({ behavior: "smooth" });
      }
   }, [emailSend]);

   const handleChange = (e) => {
      setUserData({ ...userData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      setIsError(false);
      setErrorMessage("");
      e.preventDefault();
      setLoading(true);
      if (userData.password === confirmPassword) {
         try {
            await axios.post("http://localhost:8080/auth/register", userData, {
               withCredentials: true,
               headers: {
                  "Content-Type": "application/json", // ✅ Send JSON
               },
            });
            setLoading(false);
            setEmailSend(true);
         } catch (error) {
            setLoading(false);
            if (error.response.status === 409) {
               setIsError(true);
               setErrorMessage(error.response.data);
            } else {
               console.log(error);
            }
         }
      } else {
         setIsError(true);
         setLoading(false);
         setErrorMessage("Password is not same");
      }
   };

   const handleGoogleLogin = () => {
      window.location.href =
         "http://localhost:8080/oauth2/authorization/google";
      setGoogleLogin(true);
   };

   const inputClassName =
      "px-10 outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/80 focus:border-sgreen-color/80 duration-300 p-2 rounded-full transition-all w-full";

   return (
      <div className="bg-white-color min-h-screen">
         <div className="grid grid-cols-1 md:grid-cols-2">
            <div className=" text-black mx-10 p-6 rounded-lg bg-white-color shadow-md transition-all order-2 md:order-1">
               <h2 className="text-2xl font-bold text-green-color mb-1">
                  CREATE ACCOUNT
               </h2>
               <p className="mb-4 text-gray-400 font-semibold ">tagline</p>

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
                           className={inputClassName}
                           type="text"
                           autoComplete="off"
                           name="username"
                           placeholder="Username"
                           onChange={handleChange}
                           onFocus={() => setIsError(false)}
                           required
                        />
                        {isError && errorMessage.includes("Username") && (
                           <p className="text-red-600">{errorMessage}</p>
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
                           className={inputClassName}
                           type={showPassword ? "text" : "password"}
                           name="password"
                           onPaste={(e) => e.preventDefault()} // disable pasting
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
                           className={inputClassName}
                           type={showConfirmPassword ? "text" : "password"}
                           name="password"
                           placeholder="Confirm your password"
                           onPaste={(e) => e.preventDefault()}
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
                        {isError && errorMessage.includes("Password") && (
                           <p className="text-red-500">{errorMessage}</p>
                        )}
                     </div>
                  </div>

                  <div>
                     <div className="mt-4">
                        <label className="block mb-2 text-xl text-green-color">
                           Phone Number
                        </label>
                     </div>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <MobileIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type="text"
                           name="phoneNo"
                           autoComplete="off"
                           maxLength="13"
                           placeholder="Phone Number"
                           inputMode="numeric"
                           onChange={handleChange}
                           onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                 /[^0-9+]/g,
                                 ""
                              );
                           }}
                           onFocus={() => setIsError(false)}
                           required
                        />
                     </div>
                     {isError && errorMessage.includes("Phone") && (
                        <p className="text-red-500">{errorMessage}</p>
                     )}
                  </div>
                  <div>
                     <div className="mt-4">
                        <label className="block mb-2 text-xl text-green-color">
                           Email
                        </label>
                     </div>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <EnvelopeClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type="email"
                           name="email"
                           autoComplete="off"
                           placeholder="Enter your email"
                           onChange={handleChange}
                           required
                           onFocus={() => setIsError(false)}
                        />
                     </div>
                     {isError && errorMessage.includes("Email") && (
                        <p className="text-red-500">{errorMessage}</p>
                     )}
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
                  <div className="flex justify-end mt-2 gap-2 items-center">
                     <p className="font-serif">Have an account?</p>
                     <button
                        onClick={() => navigate("/auth/login")}
                        className="group flex bg-white font-semibold items-center gap-2 py-1 px-6 border-[1.5px] border-black rounded"
                     >
                        Log In
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 duration-200 transition-all" />
                     </button>
                  </div>

                  <section
                     id="verify"
                     className={`mt-6 ${
                        emailSend ? "flex" : "hidden"
                     } flex-col items-center`}
                  >
                     <CheckCircledIcon className="w-24 h-24 text-blue-500 " />
                     <h2 className="text-2xl text-balance font-semibold">
                        We have sent you a link on your mail.
                     </h2>
                     <p className="mt-1">
                        Please open it to create your account.{" "}
                        <span className="text-red-500">
                           It will expire after 1 hour
                        </span>
                     </p>
                  </section>
               </form>

               {/* <div className="text-center my-4">
                  <button
                     className="bg-green-color hover:bg-sgreen-color text-white-color text-center p-4 rounded font-semibold"
                     onClick={handleGoogleLogin}
                  >
                     Sign in with Google
                  </button>
               </div> */}

               <Link
                  className="flex mt-2 sm:hidden justify-center text-green-color"
                  to="/"
               >
                  <img className="w-32" src={appLogo} />
               </Link>
            </div>
            <div className="hidden text-balance sm:flex order-1 md:order-2 flex-col gap-6 py-10 px-4 items-center">
               <img
                  src={dummyicon}
                  className="w-40 h-40 lg:h-50 lg:w-50 rounded-full  p-2"
               />
               <p className="text-3xl font-semi-bold text-green-color text-center">
                  Tagline
               </p>
               <div className="flex gap-2 text-balance text-center">
                  <p className="bg-green-color px-4 py-1 rounded-full text-white">
                     Why choose us
                  </p>
                  <p className="bg-green-color px-4 py-1 rounded-full text-white">
                     Why choose us
                  </p>
                  <p className="bg-green-color px-4 py-1 rounded-full text-white">
                     Why choose us
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;
