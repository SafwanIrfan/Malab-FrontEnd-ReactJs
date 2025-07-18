// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Navigate } from "react-router-dom";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//    const jwtToken = localStorage?.getItem("token");

//    // const userId = decoded.userId || decoded.id;

//    // 🔹 Login function

//    const login = async (credentials) => {
//       console.log(credentials);
//       try {
//          const response = await axios.post(
//             "http://localhost:8080/auth/login",
//             credentials,
//             {
//                withCredentials: true,
//                headers: {
//                   "Content-Type": "application/json",
//                },
//             }
//          );
//          console.log("Login Response:", response); // Debugging
//          return true;
//       } catch (error) {
//          console.error("Login failed:", error);
//          return false;
//       }
//    };

//    return (
//       <AuthContext.Provider value={{ login }}>{children}</AuthContext.Provider>
//    );
// };

// export const useAuth = () => useContext(AuthContext);
