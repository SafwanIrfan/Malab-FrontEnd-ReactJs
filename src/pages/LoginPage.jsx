import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import appLogo from "../assets/applogo.svg";

const LoginPage = () => {
   const [loading, setLoading] = useState(false);
   const [googleLogin, setGoogleLogin] = useState(false);

   const { login } = useAuth();
   const navigate = useNavigate();
   const [credentials, setCredentials] = useState({
      username: "",
      password: "",
   });

   // useEffect(() => {
   //    const jwtToken = localStorage.getItem("token");
   //    if (jwtToken) {
   //       navigate("/");
   //    }
   // }, []);

   const handleChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      const success = await login(credentials);
      if (success) {
         navigate("/"); // Redirect after login
         setLoading(false);
      } else {
         setLoading(false);
         toast.error("Invalid username or password");
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
      <div className="bg-white-color min-h-screen">
         <div className="flex justify-center items-center my-10">
            <div className="text-black w-96 p-6 rounded-lg bg-white shadow-2xl transition-all">
               <h2 className="text-3xl font-semibold mb-4 text-center text-green-color">
                  Login
               </h2>

               <form className="" onSubmit={handleSubmit}>
                  <div>
                     <label className="block mb-2 text-xl text-green-color">
                        Username
                     </label>
                     <input
                        className="focus:outline-none bg-gray-300 focus:bg-gray-100 p-2 rounded w-full"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="mt-4">
                     <label className="block mb-2 text-xl text-green-color">
                        Password
                     </label>
                     <input
                        className="focus:outline-none bg-gray-300 focus:bg-gray-100 p-2 rounded w-full"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                     />
                  </div>

                  <div className="text-center px-1 py-2 bg-green-color text-white-color hover:bg-sgreen-color mt-4 cursor-pointer rounded transition-all">
                     <button
                        className="font-semibold"
                        type="submit"
                        onClick={handleSubmit}
                     >
                        {loading ? (
                           <FaSpinner className="animate-spin text-xl" />
                        ) : (
                           "Login"
                        )}
                     </button>
                  </div>

                  <p className="text-center mt-2">
                     Not have an account?{" "}
                     <span className="text-sgreen-color hover:text-green-color font-semibold">
                        <Link to="/auth/register">Register</Link>
                     </span>
                  </p>
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
         </div>
      </div>
   );
};

export default LoginPage;
