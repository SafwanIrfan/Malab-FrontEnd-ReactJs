import {
   BrowserRouter,
   Routes,
   Route,
   Navigate,
   useLocation,
   Outlet,
} from "react-router-dom";
import HomePage from "./pages/userpages/HomePage";
import { AppProvider } from "./contexts/Context";
import CourtPage from "./pages/userpages/CourtPage";
import AddCourtPage from "./pages/ownerpages/AddCourtPage";
import { ToastContainer } from "react-toastify";
import SlotsPage from "./pages/userpages/SlotsPage";
import LoginPage from "./pages/authpages/LoginPage";
import RegisterPage from "./pages/authpages/RegisterPage";
import EditCourtPage from "./pages/ownerpages/EditCourtPage";
import Layout from "./layout/Layout";
import MyBookings from "./pages/userpages/MyBookings";
import Loading from "./smallcomponents/Loading";
import FavPage from "./pages/userpages/FavPage";
import SearchPage from "./pages/userpages/SearchPage";
import { getDecodedToken, getToken } from "./utils/authToken";
import ForgetPasswordPage from "./pages/authpages/ForgetPasswordPage";
import OwnerDashboard from "./pages/ownerpages/OwnerDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import EntryPage from "./pages/userpages/EntryPage";

const currentTime = Date.now() / 1000;

const UserRoute = ({ children }) => {
   const decodedToken = getDecodedToken();
   const location = useLocation();

   if (!decodedToken) {
      return <Navigate to="/auth/login" />;
   }

   if (decodedToken.role === "ROLE_USER") {
      console.log("1");
      if (
         location.pathname.startsWith("/user") ||
         location.pathname.startsWith("/auth")
      ) {
         return children;
      } else {
         return <NotFoundPage />;
      }
   }
};

const OwnerRoute = ({ children }) => {
   const decodedToken = getDecodedToken();
   const location = useLocation();

   if (!decodedToken) {
      return <Navigate to="/auth/login" />;
   }

   if (decodedToken.role === "ROLE_OWNER") {
      console.log("1");
      if (
         location.pathname.startsWith("/owner") ||
         location.pathname.startsWith("/auth")
      ) {
         return children;
      } else {
         return <NotFoundPage />;
      }
   }

   return <NotFoundPage />;
};

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
                  <Route path="/" element={<EntryPage />} />
                  <Route
                     path="/auth/forgotpassword"
                     element={<ForgetPasswordPage />}
                  />
                  <Route
                     path="*" // if user tries to go to pages except which are specified to him then notfound
                     element={<NotFoundPage />}
                  />

                  <Route
                     path="/user"
                     element={
                        <PrivateRoute>
                           <UserRoute>
                              <Layout />
                           </UserRoute>
                        </PrivateRoute>
                     }
                  >
                     <Route
                        index //fisrt page
                        element={<HomePage />}
                     />
                     <Route path="search/court" element={<SearchPage />} />
                     <Route path="court/:id" element={<CourtPage />} />
                     <Route
                        path="timings/:id/:day/:date"
                        element={<SlotsPage />}
                     />
                     <Route path=":usersId/slots" element={<MyBookings />} />

                     <Route path=":usersId/fav" element={<FavPage />} />
                  </Route>

                  {/* <Route
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
                  /> */}

                  <Route
                     path="/owner"
                     element={
                        <PrivateRoute>
                           <OwnerRoute>
                              <Outlet />
                           </OwnerRoute>
                        </PrivateRoute>
                     }
                  >
                     <Route path="add_court" element={<AddCourtPage />} />

                     <Route path="dashboard" element={<OwnerDashboard />} />
                     <Route path="court/:id/edit" element={<EditCourtPage />} />
                  </Route>

                  <Route element={<Layout />}>
                     {/* <Route
                        index //fisrt page
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
                     /> */}
                     {/* <Route
                        path="/court/:id/edit"
                        element={
                           <PrivateRoute>
                              <EditCourtPage />
                           </PrivateRoute>
                        }
                     /> */}
                     {/* <Route
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
                     /> */}
                  </Route>
               </Routes>
            </BrowserRouter>
         </AppProvider>
      </>
   );
}
export default App;
