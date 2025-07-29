import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { AppProvider } from "./contexts/Context";
import CourtPage from "./pages/CourtPage";
import AddCourtPage from "./pages/AddCourtPage";
import { ToastContainer } from "react-toastify";
import SlotsPage from "./pages/SlotsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EditCourtPage from "./pages/EditCourtPage";
import Layout from "./layout/Layout";
import MyBookings from "./pages/MyBookings";
import Loading from "./smallcomponents/Loading";
import FavPage from "./pages/FavPage";
import SearchPage from "./pages/SearchPage";
import { getDecodedToken, getToken } from "./utils/authToken";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import OwnerDashboard from "./pages/OwnerDashboard";

const currentTime = Date.now() / 1000;

const PrivateRoute = ({ children }) => {
   const token = getToken();

   const decodedToken = token && getDecodedToken();

   if (!token) {
      console.log("TOKEN is null : ", token);
      return <Navigate to="/auth/login" />;
   }

   try {
      // Check if the token is expired
      if (decodedToken?.exp < currentTime) {
         localStorage.removeItem("token"); // Remove expired token
         localStorage.removeItem("user"); // Remove expired token
         sessionStorage.removeItem("token");
         sessionStorage.removeItem("user");
         console.log(decodedToken?.exp);
         console.log(currentTime);
         console.log("TOKEN EXPIRED?");
         return <Navigate to="/auth/login" />;
      } else {
         return children;
      } // Render protected component
   } catch (error) {
      localStorage.removeItem("token"); // Remove invalid token
      sessionStorage.removeItem("token"); //
      console.log(error);
      return <Navigate to="/auth/login" />;
   }
};

function App() {
   return (
      <>
         <AppProvider>
            <ToastContainer />
            <BrowserRouter>
               <Routes>
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/loading" element={<Loading />} />
                  <Route
                     path="/auth/forgotpassword"
                     element={<ForgetPasswordPage />}
                  />

                  <Route
                     path="owner/add_court"
                     element={
                        <PrivateRoute>
                           <AddCourtPage />
                        </PrivateRoute>
                     }
                  />

                  <Route
                     path="/owner/dashboard"
                     element={
                        <PrivateRoute>
                           <OwnerDashboard />
                        </PrivateRoute>
                     }
                  />

                  <Route element={<Layout />}>
                     <Route
                        path="/"
                        element={
                           <PrivateRoute>
                              <HomePage />
                           </PrivateRoute>
                        }
                     />
                     <Route
                        path="/search/court"
                        element={
                           <PrivateRoute>
                              <SearchPage />
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

                     <Route
                        path="/user/:usersId/fav"
                        element={
                           <PrivateRoute>
                              <FavPage />
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
