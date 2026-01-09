import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import appLogo from "../../assets/MALABLOGO.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
   ArrowRightIcon,
   CheckCircledIcon,
   Cross2Icon,
   EnvelopeClosedIcon,
   LockClosedIcon,
   MobileIcon,
   PersonIcon,
} from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import { fetchUserDetails } from "../../services/api";

export const inputClassName =
   "px-10 font-sans outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/80 focus:border-sgreen-color/80 duration-300 py-2 rounded-full transition-all w-full";

const RegisterPage = () => {
   const [googleLogin, setGoogleLogin] = useState(false);
   const [loading, setLoading] = useState(false);
   const [loadingVerifyUser, setLoadingVerifyUser] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();

   const location = useLocation();

   const { role } = location.state || {};

   const [userData, setUserData] = useState({
      password: "",
      fullName: "",
      username: "",
      phoneNo: "",
      email: "",
      role: role,
   });
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [isError, setIsError] = useState(false);
   const [errorMessage, setErrorMessage] = useState("");
   const [emailSend, setEmailSend] = useState(false);
   const [userPicture, setUserPicture] = useState(null);

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

   const { refetch: fetchUser } = fetchUserDetails(userData?.username || "");

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

   // for bad user input and better UX
   useEffect(() => {
      if (errorMessage.includes("Username")) {
         document
            .getElementById("usernameError")
            ?.scrollIntoView({ behavior: "smooth" });
      } else if (errorMessage.includes("Password")) {
         document
            .getElementById("passwordError")
            ?.scrollIntoView({ behavior: "smooth" });
      } else if (errorMessage.includes("Phone")) {
         document
            .getElementById("phoneError")
            ?.scrollIntoView({ behavior: "smooth" });
      } else if (errorMessage.includes("Image")) {
         document
            .getElementById("imageError")
            ?.scrollIntoView({ behavior: "smooth" });
      } else if (errorMessage.includes("Email")) {
         document
            .getElementById("emailError")
            ?.scrollIntoView({ behavior: "smooth" });
      }
   }, [errorMessage]);

   const handleChange = (e) => {
      setUserData({ ...userData, [e.target.name]: e.target.value });
   };

   const handleUserPictureChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
         setUserPicture(file);
      }
   };

   const handleRemoveUserPicture = () => {
      setUserPicture(null);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsError(false);
      setErrorMessage("");
      setLoading(true);

      if (userData.password === confirmPassword) {
         if (userPicture === null) {
            setIsError(true);
            setErrorMessage("Please select Image");
            setLoading(false);
            return;
         }

         try {
            await axios.post("http://localhost:8080/auth/register", userData, {
               headers: {
                  "Content-Type": "application/json", // ✅ Send JSON
               },
            });

            const formData = new FormData();
            formData.append("username", userData.username);
            formData.append("userFile", userPicture);

            await axios.post("http://localhost:8080/auth/add_image", formData, {
               headers: {
                  "Content-Type": "multipart/form-data", // ✅ Send Multipart
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

   const handleVerifyUser = async () => {
      setLoadingVerifyUser(true);
      const { data: userDetails, error } = await fetchUser();
      const finalUserData = userDetails?.data;
      if (finalUserData?.isVerified) {
         userData.role === "ROLE_USER";
         navigate("/auth/login");

         setUserData({
            fullName: "",
            password: "",
            username: "",
            phoneNo: null,
            email: "",
         });

         setConfirmPassword("");
         setUserPicture(null);
         setLoadingVerifyUser(false);
      } else {
         setLoadingVerifyUser(false);
         toast.error("You have not clicked the link.");
      }

      if (error) {
         setLoadingVerifyUser(false);
         return error.message;
      }
   };

   const handleGoogleLogin = () => {
      window.location.href =
         "http://localhost:8080/oauth2/authorization/google";
      setGoogleLogin(true);
   };

   return (
      <div className=" min-h-screen">
         <div className="grid grid-cols-1 md:grid-cols-2 ">
            <div className=" my-4 rounded-full mt-4 mx-auto sm:hidden justify-center ">
               <img className="w-40" src={appLogo} />
            </div>
            <div className=" text-black border-[1px] border-blackberry-color p-6 shadow-md transition-all order-2 md:order-1">
               <h2 className="text-2xl font-bold text-green-color mb-1">
                  CREATE ACCOUNT
               </h2>
               <p className="mb-4 text-gray-500 ">
                  {role === "ROLE_USER"
                     ? "Join us and Play with Ease"
                     : "Add your personal information"}
               </p>

               <form onSubmit={handleSubmit}>
                  <div id="usernameError">
                     <label className="block mb-2 text-xl text-green-color">
                        <span className="text-red-500">*</span> Username
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
                        <span className="text-red-500">*</span> Full Name
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <PersonIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type="text"
                           autoComplete="off"
                           name="fullName"
                           placeholder="Your good name"
                           onChange={handleChange}
                           required
                        />
                     </div>
                  </div>

                  <div className="mt-4">
                     <label className="block mb-2 text-xl text-green-color">
                        <span className="text-red-500">*</span> Password
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <LockClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type={showPassword ? "text" : "password"}
                           minLength={6}
                           maxLength={12}
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

                  <div id="passwordError" className="mt-4">
                     <label className="block mb-2 text-xl text-green-color">
                        <span className="text-red-500">*</span> Confirm Password
                     </label>
                     <div className="relative">
                        <p className="absolute left-3 top-3">
                           <LockClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type={showConfirmPassword ? "text" : "password"}
                           minLength={6}
                           maxLength={12}
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
                     <div className="mt-4 mb-2">
                        <label className="block text-xl text-green-color">
                           <span className="text-red-500">*</span> Phone Number
                        </label>
                        <p className="px-4 text-gray-500 text-balance">
                           Your phone number must be active
                        </p>
                     </div>
                     <div id="phoneError" className="relative">
                        <p className="absolute left-3 top-3">
                           <MobileIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type="text"
                           name="phoneNo"
                           autoComplete="off"
                           minLength="11"
                           maxLength="11"
                           placeholder="03XXXXXXXXX"
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
                           <span className="text-red-500">*</span> Email
                        </label>
                     </div>
                     <div id="emailError" className="relative">
                        <p className="absolute left-3.5 top-3">
                           <EnvelopeClosedIcon className="w-5 h-5" />
                        </p>
                        <input
                           className={inputClassName}
                           type="email"
                           name="email"
                           autoComplete="off"
                           placeholder="abcd@gmail.com"
                           onChange={handleChange}
                           required
                           onFocus={() => setIsError(false)}
                        />
                     </div>
                     {isError && errorMessage.includes("Email") && (
                        <p className="text-red-500">{errorMessage}</p>
                     )}
                  </div>

                  <div className="flex flex-col gap-0.2 mt-4">
                     <label
                        id="imageError"
                        className="block text-xl mb-2 text-green-color"
                     >
                        <span className="text-red-500">*</span>
                        Upload Your Image
                     </label>
                     <input
                        type="file"
                        id="userPicture"
                        onChange={(e) => handleUserPictureChange(e)}
                        accept="image/*"
                        style={{ display: "none" }}
                     />
                     <label
                        htmlFor="userPicture"
                        className="cursor-pointer text-center bg-white p-2 w-40 rounded border-[1px] border-blackberry-color hover:bg-white-color transition-all"
                     >
                        Upload Image
                     </label>
                     {isError && errorMessage.includes("Image") && (
                        <p className="text-red-600 mt-1">{errorMessage}</p>
                     )}
                     {userPicture !== null && (
                        <div>
                           <div className="relative inline-block mt-4">
                              <img
                                 src={
                                    userPicture instanceof File &&
                                    URL?.createObjectURL(userPicture)
                                 }
                                 alt={`Selected image`}
                                 className="w-20 h-20 object-cover border-[1px] shadow-lg border-blackberry-color"
                              />
                              <button
                                 type="button"
                                 onClick={handleRemoveUserPicture}
                                 className="bg-white hover:bg-white-color absolute -top-1 -right-1  rounded-full p-1 transition-all"
                              >
                                 <Cross2Icon className="text-red-600 size-4" />
                              </button>
                           </div>
                        </div>
                     )}
                  </div>

                  <button
                     disabled={loading}
                     className="w-full text-xl text-center px-1 py-2 bg-green-color text-white-color hover:bg-sgreen-color hover:text-black mt-4 cursor-pointer rounded transition-all font-semibold font-sans"
                     type="submit"
                  >
                     {loading ? (
                        <FaSpinner className="w-full animate-spin flex text-xl" />
                     ) : (
                        "Register"
                     )}
                  </button>
               </form>

               <div className="flex justify-end mt-2 gap-2 items-center">
                  <p>Have an account?</p>
                  <button
                     onClick={() => navigate("/auth/login")}
                     className="group flex bg-white font-sans font-semibold items-center gap-2 py-1 px-6 border-[1.5px] border-black rounded"
                  >
                     Log In
                     <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 duration-200 transition-all" />
                  </button>
               </div>

               <section
                  id="verify"
                  className={`mt-6 flex ${emailSend ? "flex" : "hidden"}
                  flex-col items-center`}
               >
                  <CheckCircledIcon className="w-24 h-24 text-blue-500 " />
                  <h2 className="text-2xl text-balance font-semibold text-center">
                     We have sent you a link on your mail.
                  </h2>
                  <p className="mt-1 text-center text-balance">
                     Please open it to create your account and press the button
                     below.{" "}
                     <span className="text-red-500">
                        It will expire after 1 hour
                     </span>
                  </p>
                  <button
                     disabled={loadingVerifyUser}
                     onClick={handleVerifyUser}
                     className="mt-4 w-full bg-green-color text-white hover:bg-sgreen-color hover:text-black py-2 px-4 rounded transition-all "
                  >
                     {loadingVerifyUser ? (
                        <FaSpinner className="w-full animate-spin flex text-xl" />
                     ) : (
                        "I have clicked the link!"
                     )}
                  </button>
               </section>

               {/* <div className="text-center my-4">
                  <button
                     className="bg-green-color hover:bg-sgreen-color text-white-color text-center p-4 rounded font-semibold"
                     onClick={handleGoogleLogin}
                  >
                     Sign in with Google
                  </button>
               </div> */}
            </div>
            <div className="hidden bg-green-color text-balance sm:flex order-1 md:order-2 flex-col gap-6 py-10 px-4 items-center">
               <img
                  src={appLogo}
                  className="w-40 bg-white-color h-40 lg:h-56 lg:w-56 shadow-lg rounded-full  p-2"
               />
               <p className="text-3xl font-semi-bold text-white-color text-center">
                  Find a court and book it just by one click!
               </p>
               <div className="flex gap-2 text-balance text-center">
                  <p className="bg-blackberry-color px-4 py-2 rounded-full text-white">
                     100+ Courts
                  </p>
                  <p className="bg-blackberry-color px-4 py-2 rounded-full text-white">
                     Secure Transactions
                  </p>
                  <p className="bg-blackberry-color px-4 py-2 rounded-full text-white">
                     5000+ Users
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default RegisterPage;
