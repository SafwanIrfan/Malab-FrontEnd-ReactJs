import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import appLogo from "../../assets/MALABLOGO.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
   ArrowRightIcon,
   LockClosedIcon,
   PersonIcon,
} from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserDetails, URL_CONFIG } from "../../services/api";

const LoginPage = () => {
   const [googleLogin, setGoogleLogin] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [credentials, setCredentials] = useState({
      username: "",
      password: "",
   });
   const [rememberMe, setRememberMe] = useState(false);
   const [createAccountBtn, setCreateAccountBtn] = useState(false);

   const navigate = useNavigate();

   const location = useLocation();

   if (location.pathname != "/auth/forgotpassword") {
      localStorage.setItem("resetPassword", false);
      localStorage.setItem("emailSend", false);
      localStorage.setItem("userData", null);
   }

   // useEffect(() => {
   //    const jwtToken = localStorage.getItem("token");
   //    if (jwtToken) {
   //       navigate("/");
   //    }
   // }, []);

   const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const { refetch: fetchUserData } = fetchUserDetails(credentials.username);

   // const fetchUser = async (username) => {
   //    try {
   //       const userResponse = await axios.get(
   //          `http://localhost:8080/auth/user/${username}`
   //       );
   //       console.log(userResponse);
   //       console.log(userResponse.data);
   //       return userResponse.data;
   //    } catch (error) {
   //       return error;
   //    }
   // };

   const queryClient = useQueryClient();

   const url = URL_CONFIG.BASE_URL;

   const loginUserMutation = useMutation({
      mutationFn: (userDetails) => axios.post(`${url}/auth/login`, userDetails),
      onSuccess: () => {
         queryClient.invalidateQueries("users");
      },
      onError: (error) => {
         console.error(
            "Mutation error:",
            error.response || error.message || error
         );
      },
   });

   const handleSubmit = async (e) => {
      console.log("BRO");
      e.preventDefault();
      setLoading(true);
      // const response = await axios.post(
      //    "http://localhost:8080/auth/login",
      //    credentials,
      //    {
      //       withCredentials: true,
      //       headers: {
      //          "Content-Type": "application/json",
      //       },
      //    }
      // );
      try {
         const res = await loginUserMutation.mutateAsync(credentials);
         const loginData = res.data;
         const { data: user } = await fetchUserData();
         const userDetails = user?.data;
         const isUserValid = userDetails?.isVerified;

         if (!isUserValid) {
            // user is not valid
            toast.error("Please validate your account first!");
         } else {
            if (userDetails?.role === "ROLE_USER") {
               navigate("/user"); // Redirect after login
            } else if (userDetails?.role === "ROLE_OWNER") {
               navigate("/owner/dashboard");
            } else {
               navigate("/admin/dashboard");
            }
            console.log(loginData);
            toast.success("Successfully Logged In!");

            const token = loginData?.split(".")?.length === 3 && loginData;

            if (rememberMe) {
               localStorage.setItem("token", token);
               localStorage.setItem(
                  "username",
                  JSON.stringify(credentials.username)
               );
            } else {
               sessionStorage.setItem("token", token);
               sessionStorage.setItem(
                  "username",
                  JSON.stringify(credentials.username)
               );
            }
         }
      } catch (error) {
         toast.error("Invalid username or password");
         console.log(error);
      } finally {
         setLoading(false);
      }
   };

   const handleGoogleLogin = () => {
      window.location.href =
         "http://localhost:8080/oauth2/authorization/google";
      setGoogleLogin(true);
   };

   // useEffect(() => {
   //    if (googleLogin) {
   //       try {
   //          axios.get("http://localhost:8080/auth/callback", {
   //             withCredentials: true,
   //          });
   //          setGoogleLogin(false);
   //       } catch (error) {
   //          console.log("ERROR SCN : ", error);
   //          setGoogleLogin(false);
   //       }
   //    }
   // }, [googleLogin]);

   return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom right, #eee8f3, white, #eee8f3)' }}>
         <div className="flex py-6 px-6 sm:px-8 justify-start text-green-color">
            <img className="w-24 md:w-32 transition-transform hover:scale-105 duration-300" src={appLogo} alt="PlayWithEase Logo" />
         </div>
         <div className="flex justify-center items-center my-6 sm:my-10 px-4 sm:px-8 pb-8">
            <div className="w-full max-w-md text-black border-2 border-blackberry-color p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl transition-all hover:shadow-3xl">
               <h2 className="text-3xl sm:text-4xl font-black mb-2 text-green-color">
                  LOGIN
               </h2>
               <p className="mb-6 text-gray-500 text-sm sm:text-base">
                  Just few steps ahead to start your journey!
               </p>

               <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                     <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none">
                           <PersonIcon className="w-5 h-5" />
                        </div>
                        <input
                           className="pl-12 pr-4 py-3 outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 rounded-xl transition-all w-full bg-white-color/50"
                           type="text"
                           name="username"
                           autoComplete="off"
                           placeholder="Enter your username"
                           onChange={handleChange}
                           required
                        />
                     </div>
                  </div>

                  <div>
                     <div className="relative">
                        <div className="absolute left-4 top-4 text-gray-400 z-10 pointer-events-none">
                           <LockClosedIcon className="w-5 h-5" />
                        </div>
                        <input
                           className="pl-12 pr-12 py-3 outline-none border-2 border-sgreen-color/40 hover:border-sgreen-color/60 focus:border-sgreen-color focus:ring-2 focus:ring-sgreen-color/20 duration-300 rounded-xl transition-all w-full bg-white-color/50"
                           type={showPassword ? "text" : "password"}
                           name="password"
                           placeholder="Enter your password"
                           onChange={handleChange}
                           required
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((prev) => !prev)}
                           className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1"
                           aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                           {showPassword ? (
                              <FaEyeSlash className="w-5 h-5" />
                           ) : (
                              <FaEye className="w-5 h-5" />
                           )}
                        </button>
                        <div className="mt-3 flex flex-col sm:flex-row justify-between items-center gap-3">
                           <div className="flex items-center gap-2">
                              <input
                                 className="w-4 h-4 cursor-pointer accent-green-color"
                                 type="checkbox"
                                 name="KeepMeSignedIn"
                                 value={rememberMe}
                                 onChange={() => setRememberMe(!rememberMe)}
                                 id="rememberMe"
                              />
                              <label htmlFor="rememberMe" className="text-sm sm:text-base text-gray-700 cursor-pointer">
                                 Keep me signed in
                              </label>
                           </div>
                           <Link
                              to="/auth/forgotpassword"
                              className="text-red-500 hover:text-red-700 text-sm sm:text-base transition-all font-medium whitespace-nowrap"
                           >
                              Forgot password?
                           </Link>
                        </div>
                     </div>
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="text-center text-lg font-semibold w-full px-4 py-3 bg-green-color text-white-color hover:bg-sgreen-color hover:text-black mt-6 cursor-pointer rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                     {loading ? (
                        <span className="flex items-center justify-center gap-2">
                           <FaSpinner className="animate-spin text-xl" />
                           <span>Logging in...</span>
                        </span>
                     ) : (
                        "Login"
                     )}
                  </button>

                  <div className="flex flex-col gap-4 mt-6 pt-4 border-t border-gray-200">
                     <p className="text-center text-gray-600">
                        {createAccountBtn
                           ? "Create account"
                           : "Don't have an account?"}
                     </p>
                     {createAccountBtn ? (
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                           <button
                              onClick={() =>
                                 navigate("/auth/register", {
                                    state: {
                                       role: "ROLE_USER",
                                    },
                                 })
                              }
                              className="flex-1 bg-white hover:bg-white-color transition-all font-semibold items-center justify-center py-2.5 px-6 rounded-lg border-2 border-blackberry-color hover:border-green-color shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                           >
                              For booking slots
                           </button>
                           <button
                              onClick={() =>
                                 navigate("/auth/register", {
                                    state: {
                                       role: "ROLE_OWNER",
                                    },
                                 })
                              }
                              className="flex-1 bg-white hover:bg-white-color transition-all font-semibold items-center justify-center py-2.5 px-6 rounded-lg border-2 border-blackberry-color hover:border-green-color shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                           >
                              For my court
                           </button>
                        </div>
                     ) : (
                        <button
                           onClick={() => setCreateAccountBtn(true)}
                           className="flex bg-white hover:bg-white-color transition-all font-semibold items-center justify-center gap-2 py-2.5 px-6 border-2 border-blackberry-color rounded-lg hover:border-green-color shadow-md hover:shadow-lg transform hover:-translate-y-0.5 w-full sm:w-auto mx-auto"
                        >
                           Create Account
                           <ArrowRightIcon className="w-4 h-4" />
                        </button>
                     )}
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
