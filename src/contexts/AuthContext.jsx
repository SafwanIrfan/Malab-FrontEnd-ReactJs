import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const [currentUser, setCurrentUser] = useState(null);
   const jwtToken = localStorage.getItem("token");

   // const userId = decoded.userId || decoded.id;

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const response = await axios.get(
               `http://localhost:8080/auth/user/${username}`,
               {
                  headers: {
                     Authorization: `Bearer ${jwtToken}`,
                  },
               }
            );
            console.log(response.data);
            setCurrentUser(response.data);
         } catch (error) {
            console.log("Error Fetching User : ", error);
            <Navigate to="/auth/login" />;
         }
      };
      fetchUser();
   }, []);

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
         return false;
      }
   };
   const login = async (credentials) => {
      console.log(credentials);
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

   const username = JSON.parse(localStorage.getItem("user"));

   return (
      <AuthContext.Provider value={{ register, login, jwtToken, currentUser }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
