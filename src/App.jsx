import { BrowserRouter, Routes, Route } from "react-router-dom";
import Identification from "./pages/Identification";
import UserSignup from "./pages/UserSignup";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { AppProvider } from "./contexts/Context";
import CourtPage from "./pages/CourtPage";
import CourtsPage from "./pages/CourtsPage";
import AddCourtPage from "./pages/AddCourtPage";
import { ToastContainer } from "react-toastify";
import SlotsPage from "./pages/SlotsPage";
import FinalBooking from "./pages/FinalBooking";

function App() {
   return (
      <AppProvider>
         <ToastContainer />
         <BrowserRouter>
            <Navbar />
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/courts" element={<CourtsPage />} />
               <Route path="/court/:id" element={<CourtPage />} />
               <Route path="/add_court" element={<AddCourtPage />} />
               <Route path="/timings/:id/:day/:date" element={<SlotsPage />} />
               <Route path="/identification" element={<Identification />} />
               <Route path="/user-signup" element={<UserSignup />} />
               <Route path="/booking" element={<FinalBooking />} />
            </Routes>
         </BrowserRouter>
      </AppProvider>
   );
}
export default App;
