import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { AppProvider } from "./contexts/Context";
import CourtPage from "./pages/CourtPage";
import CourtsPage from "./pages/CourtsPage";
import AddCourtPage from "./pages/AddCourtPage";
import { ToastContainer } from "react-toastify";
import SlotsPage from "./pages/SlotsPage";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditCourtPage from "./pages/EditCourtPage";
import Layout from "./layout/Layout";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import MyBookings from "./pages/MyBookings";

const PrivateRoute = ({ children }) => {
   // useEffect(()=>{
   //    const decodedToken = jwtDecode(jwtToken);
   //    const currentTime = Date.now() / 1000;
   //    if (decodedToken.exp < currentTime) {
   //       localStorage.removeItem("token"); // Remove expired token
   //       localStorage.removeItem("user");
   //    }
   // },[])

   const jwtToken = localStorage.getItem("token");

   if (!jwtToken) {
      console.log("APP :", jwtToken);
      return <Navigate to="/auth/login" />;
   }

   try {
      console.log(jwtToken);
      const decodedToken = jwtDecode(jwtToken);
      const currentTime = Date.now() / 1000; // Convert to seconds

      // Check if the token is expired
      if (decodedToken.exp < currentTime) {
         localStorage.removeItem("token"); // Remove expired token
         localStorage.removeItem("user"); // Remove expired token
         return <Navigate to="/auth/login" />;
      }
      return children; // Render protected component
   } catch (error) {
      localStorage.removeItem("token"); // Remove invalid token
      console.log(error);
      return <Navigate to="/auth/login" />;
   }
};

const jwtToken = localStorage.getItem("token");

const decodedToken = jwtToken ? jwtDecode(jwtToken) : "";
const currentTime = Date.now() / 1000; // Convert to seconds

// Check if the token is expired
if (decodedToken.exp < currentTime) {
   localStorage.removeItem("token"); // Remove expired token
   localStorage.removeItem("user"); // Remove expired token
}

function App() {
   return (
      <>
         <AppProvider>
            <ToastContainer />
            <BrowserRouter>
               <Routes>
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />

                  <Route element={<Layout />}>
                     <Route path="/" element={<HomePage />} />
                     <Route
                        path="/courts"
                        element={
                           <PrivateRoute>
                              <CourtsPage />
                           </PrivateRoute>
                        }
                     />
                     <Route
                        path="/court/:id"
                        element={
                           <PrivateRoute>
                              <CourtPage />
                           </PrivateRoute>
                        }
                     />
                     <Route
                        path="/add_court"
                        element={
                           <PrivateRoute>
                              <AddCourtPage />
                           </PrivateRoute>
                        }
                     />
                     <Route
                        path="/court/:id/edit"
                        element={
                           <PrivateRoute>
                              <EditCourtPage />
                           </PrivateRoute>
                        }
                     />
                     <Route
                        path="/timings/:id/:day/:date"
                        element={
                           <PrivateRoute>
                              <SlotsPage />
                           </PrivateRoute>
                        }
                     />
                     <Route
                        path="/user/:usersId/slots"
                        element={
                           <PrivateRoute>
                              <MyBookings />
                           </PrivateRoute>
                        }
                     />
                  </Route>
               </Routes>
            </BrowserRouter>
         </AppProvider>
      </>
   );
}
export default App;
