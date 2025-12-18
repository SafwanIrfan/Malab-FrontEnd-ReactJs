import { useEffect, useState } from "react";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";
import axios from "axios";
import { ThumbsUpIcon } from "lucide-react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { fetchUserDetails } from "../../services/api";
import { useNavigate } from "react-router-dom";

const ForgetPasswordPage = () => {
   const [email, setEmail] = useState("");
   const [loadingEmail, setLoadingEmail] = useState(false);
   const [loadingReset, setLoadingReset] = useState(false);
   const [blockedUntil, setBlockedUntil] = useState(null);
   const [error, setError] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [canReset, setCanReset] = useState(() => {
      return localStorage.getItem("resetPassword") === "true";
   });

   const navigate = useNavigate();

   const emailSend = localStorage.getItem("emailSend");
   let userData = localStorage.getItem("userData");
   let tooManyAttempts = Number(localStorage.getItem("tooManyAttempts")) || 0;

   const { refetch: fetchUserData } = fetchUserDetails(
      userData?.username || ""
   );

   useEffect(() => {
      console.log(userData);
   }, [userData]);

   useEffect(() => {
      console.log(blockedUntil);
      console.log(tooManyAttempts);
      const interval = setInterval(() => {
         if (blockedUntil && Date.now() > blockedUntil) {
            setBlockedUntil(null);
            localStorage.setItem("tooManyAttempts", 0);
         }
      }, 1000);

      return () => clearInterval(interval);
   }, [blockedUntil]);

   const handleVerifyEmail = async () => {
      setLoadingReset(true);
      const { data: user, error } = await fetchUserData();
      const updatedUser = user?.data;
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      if (updatedUser?.canChangePassword) {
         localStorage.setItem("resetPassword", true);
         setCanReset(true);
         setLoadingReset(false);
      } else {
         toast.error("Please click the link first.");
         setLoadingReset(false);
      }

      if (error) {
         return error.message;
      }
   };

   const handleSendEmail = async (e) => {
      setError("");
      e.preventDefault();

      if (tooManyAttempts >= 2 && !blockedUntil) {
         setBlockedUntil(Date.now() + 5 * 60 * 1000);
         setError("Too many attempts! Try again later.");

         localStorage.setItem("emailSend", false);
         return;
      }

      if (blockedUntil) {
         setError("Too many attempts! Try again later.");
         localStorage.setItem("emailSend", false);
         return;
      }

      localStorage.setItem("tooManyAttempts", String(tooManyAttempts + 1));

      setLoadingEmail(true);
      try {
         const response = await axios.post(
            "http://localhost:8080/auth/forget-pass/send-email",
            { email },
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         const data = response.data;

         console.log(response.data);

         if (data) {
            localStorage.setItem("userData", JSON.stringify(data));
            localStorage.setItem("emailSend", true);
         } else {
            localStorage.setItem("emailSend", false);
            setError("Email not found! Please enter correct email.");
         }
      } catch (error) {
         console.log(error);
         localStorage.setItem("emailSend", false);
         setError("Email not found! Please enter correct email.");
      } finally {
         setLoadingEmail(false);
      }
   };

   const handleResetPassword = async (e) => {
      e.preventDefault();
      setLoadingReset(true);
      if (password !== confirmPassword) {
         toast.error("Passwords do not match");
         setLoadingReset(false);
         return;
      }

      try {
         await axios.post(
            "http://localhost:8080/auth/reset-password",
            { username: userData?.username, newPassword: password },
            {
               headers: { "Content-Type": "application/json" },
            }
         );
         toast.success("Password changed successfully. ");
         navigate("/auth/login");
         localStorage.setItem("resetPassword", false);
         localStorage.setItem("emailSend", false);
         localStorage.setItem("userData", null);
         localStorage.setItem("tooManyAttempts", 0);
      } catch (error) {
         console.log(error);
      } finally {
         setLoadingReset(false);
      }
   };

   return (
      <section>
         {!canReset && (
            <div className="flex flex-col items-center mt-20 px-8">
               <h1 className="text-4xl">Verification</h1>
               <p className="mt-2 text-balance text-center text-gray-800">
                  We will verify you by sending you a link on your email
               </p>
               <div className="mt-8 ">
                  <div className="relative px-8 bg-white-color rounded border-[1px] border-transparent focus-within:border-[1px] focus-within:border-blackberry-color hover:border-[1px] hover:border-blackberry-color transition-all ">
                     <p className="absolute left-3 top-3">
                        <EnvelopeClosedIcon className="w-5 h-5" />
                     </p>
                     <input
                        className="bg-transparent p-2 w-60 focus:outline-none rounded"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setError("")}
                        required
                     />
                  </div>
               </div>
               <button
                  onClick={handleSendEmail}
                  className="py-2 px-4 bg-green-color hover:bg-sgreen-color rounded text-white mt-4 transition-all  sm:w-40"
               >
                  {loadingEmail ? (
                     <FaSpinner className="w-full animate-spin flex text-xl" />
                  ) : (
                     "Send Link"
                  )}
               </button>

               {error && (
                  <div>
                     <p className="text-red-500  mt-4">{error}</p>
                  </div>
               )}

               {emailSend === "true" && (
                  <section>
                     <div className="flex flex-col  items-center justify-center mt-6 ">
                        <ThumbsUpIcon className=" w-10 h-10" />
                        <h2 className="text-xl   mt-2">
                           Email sent successfully!
                        </h2>
                     </div>

                     <div className="mt-6 flex flex-col items-center">
                        <p className="text-balance font-semibold  text-center">
                           After clicking link from your email, press the button
                           to reset password.
                        </p>
                        <button
                           className="py-2 px-4 bg-green-color hover:bg-sgreen-color rounded text-white mt-4 transition-all  sm:w-40"
                           onClick={handleVerifyEmail}
                        >
                           {loadingReset ? (
                              <FaSpinner className="w-full animate-spin flex text-xl" />
                           ) : (
                              "Reset Password"
                           )}{" "}
                        </button>
                     </div>
                  </section>
               )}
            </div>
         )}

         {canReset && (
            <form
               onSubmit={handleResetPassword}
               className="flex flex-col items-center mt-20"
            >
               <div className="relative px-8 mb-4 bg-white-color rounded border-[1px] border-transparent focus-within:border-[1px] focus-within:border-blackberry-color hover:border-[1px] hover:border-blackberry-color transition-all ">
                  <p className="absolute left-3 top-3">
                     <EnvelopeClosedIcon className="w-5 h-5" />
                  </p>
                  <input
                     className="bg-transparent p-2 sm:w-80 focus:outline-none rounded"
                     type={showPassword ? "text" : "password"}
                     value={password}
                     minLength={6}
                     maxLength={12}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="New Password"
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

               <div className="relative px-8 bg-white-color rounded border-[1px] border-transparent focus-within:border-[1px] focus-within:border-blackberry-color hover:border-[1px] hover:border-blackberry-color transition-all ">
                  <p className="absolute left-3 top-3">
                     <EnvelopeClosedIcon className="w-5 h-5" />
                  </p>
                  <input
                     className="bg-transparent p-2 sm:w-80 focus:outline-none rounded"
                     type={showConfirmPassword ? "text" : "password"}
                     value={confirmPassword}
                     minLength={6}
                     maxLength={12}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     onPaste={(e) => e.preventDefault()}
                     placeholder="Confirm Password"
                     required
                  />
                  <button
                     type="button"
                     onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                     {showConfirmPassword ? (
                        <FaEyeSlash className="absolute right-4 top-3 " />
                     ) : (
                        <FaEye className="absolute right-4 top-3 " />
                     )}
                  </button>
               </div>
               <button
                  type="submit"
                  className="py-2 px-4 bg-green-color hover:bg-sgreen-color rounded text-white mt-4 transition-all  w-40"
               >
                  {loadingReset ? (
                     <FaSpinner className="w-full animate-spin flex text-xl" />
                  ) : (
                     "Reset Password"
                  )}
               </button>
            </form>
         )}
      </section>
   );
};

export default ForgetPasswordPage;
