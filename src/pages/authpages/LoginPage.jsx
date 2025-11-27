import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import appLogo from "../../assets/applogo.svg";
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
      <div>
         <div className="flex py-4 px-8 justify-start text-green-color">
            <img className="w-15 h-15 sm:w-max" src={appLogo} />
         </div>
         <div className="flex justify-center items-center  my-10 px-8 ">
            <div className=" text-black border-[2px] border-blackberry-color  p-6 rounded-lg bg-white shadow-2xl transition-all">
               <h2 className="text-2xl font-black mb-1  text-green-color">
                  LOGIN
               </h2>
               <p className="mb-4 text-gray-400 font-serif ">
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
                           placeholder="Username"
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
                        <div className="mt-2 flex justify-between gap-4">
                           <div className="flex gap-2">
                              <input
                                 className="mt-[4px] w-3 h-3  sm:w-4  sm:h-4 cursor-pointer"
                                 type="checkbox"
                                 name="KeepMeSignedIn"
                                 value={rememberMe}
                                 onChange={() => setRememberMe(!rememberMe)}
                              />
                              <label className="text-sm sm:text-base">
                                 Keep me signed in
                              </label>
                           </div>
                           <Link
                              to="/auth/forgotpassword"
                              className="text-red-500 hover:text-red-700 text-sm sm:text-base transition-all"
                           >
                              Forgot password?
                           </Link>
                        </div>
                     </div>
                  </div>

                  <button
                     type="submit"
                     className="text-center text-xl font-semibold w-full px-1 py-2 bg-green-color text-white-color hover:bg-sgreen-color mt-6 cursor-pointer rounded transition-all"
                     onClick={() => handleSubmit}
                  >
                     {loading ? (
                        <FaSpinner className="w-full animate-spin text-xl" />
                     ) : (
                        "Login"
                     )}
                  </button>

                  <div className="flex flex-col sm:flex-row gap-2 mt-4 items-center justify-between">
                     <p className="text-balance  font-serif">
                        {createAccountBtn
                           ? "Create account"
                           : "Not have an account?"}
                     </p>
                     {createAccountBtn ? (
                        <div className="flex flex-col border-[1px] border-blackberry-color rounded ">
                           <button
                              onClick={() =>
                                 navigate("/auth/register", {
                                    state: {
                                       role: "ROLE_USER",
                                    },
                                 })
                              }
                              className=" bg-white hover:bg-white-color transition-all font-semibold items-center py-2 px-6 rounded-t "
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
                              className="bg-white hover:bg-white-color transition-all font-semibold items-center  py-2 px-6 rounded-b "
                           >
                              For my court
                           </button>
                        </div>
                     ) : (
                        <button
                           onClick={() => setCreateAccountBtn(true)}
                           className="flex bg-white hover:bg-white-color transition-all font-semibold items-center gap-2 py-1 px-6 border-[1px] border-black rounded"
                        >
                           Create Account
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
