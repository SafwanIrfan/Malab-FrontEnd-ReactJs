import { createContext, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const jwtToken = localStorage.getItem("token");

   // 🔹 Login function
   const register = async (credentials) => {
      try {
         await axios.post("http://localhost:8080/auth/register", credentials, {
            withCredentials: true,
            headers: {
               "Content-Type": "application/json", // ✅ Send JSON
            },
         });
         toast.success("Successfully Registered!");
         return true;
      } catch (error) {
         console.error("Register failed:", error);
         toast.error("Register Failed!");
         return false;
      }
   };
   const login = async (credentials) => {
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
         console.log("Login Response:", response); // Debugging

         const jwtToken = response.data;

         localStorage.setItem("token", jwtToken);
         localStorage.setItem("user", JSON.stringify(credentials.username));
         toast.success("Successfully Logged In!");
         return true;
      } catch (error) {
         console.error("Login failed:", error);
         return false;
      }
   };

   return (
      <AuthContext.Provider value={{ register, login, jwtToken }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
