import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
   useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
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

const currentTime = Date.now() / 1000;

const decodedToken = getDecodedToken();

const PrivateRoute = ({ children }) => {
   const token = getToken();

   if (token === null) {
      return <Navigate to="/auth/login" replace />;
   }

   try {
      // Check if the token is expired
      if (decodedToken?.exp < currentTime) {
         localStorage.removeItem("token"); // Remove expired token
         localStorage.removeItem("user"); // Remove expired token
         sessionStorage.removeItem("token");
         sessionStorage.removeItem("user");
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

                  <Route element={<Layout />}>
                     <Route path="/" element={<HomePage />} />
                     <Route path="/search/court" element={<SearchPage />} />

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
