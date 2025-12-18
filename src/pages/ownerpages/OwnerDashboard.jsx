import React, { useEffect, useState } from "react";
import { clearAuth, getDecodedToken, getToken } from "../../utils/authToken";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../../smallcomponents/Loading";
import { toast } from "react-toastify";
import ConfirmationModal from "../../smallcomponents/ConfirmationModal";
import { format } from "date-fns";
import Modal from "react-modal";

Modal.setAppElement("#root");

// Booking Details Modal Component
const BookingDetailsModal = ({ isOpen, onClose, booking, userDetails, loading }) => {
   const formatTime = (time) => {
      if (!time) return "";
      const timeStr = time.toString();
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || 0), 0);
      return format(date, "h:mm a");
   };

   const formatDate = (date) => {
      if (!date) return "";
      const formattedDate = new Date(date);
      return format(formattedDate, "do MMMM yyyy");
   };

   if (!booking) return null;

   return (
      <Modal
         isOpen={isOpen}
         onRequestClose={onClose}
         className="bg-white border-2 border-blackberry-color text-black p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transition-all"
         overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
         closeTimeoutMS={200}
      >
         <div className="relative">
            <button
               className="absolute right-0 top-0 text-gray-400 hover:text-red-500 transition-colors"
               onClick={onClose}
               aria-label="Close modal"
            >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>

            <h2 className="text-2xl sm:text-3xl font-black text-blackberry-color mb-6">
               Booking Details
            </h2>

            {loading ? (
               <div className="flex justify-center py-8">
                  <Loading />
               </div>
            ) : (
               <div className="space-y-6">
                  {/* User Information */}
                  {userDetails && (
                     <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="text-xl font-bold text-blackberry-color mb-4">
                           Customer Information
                        </h3>
                        <div className="flex items-start gap-4">
                           {userDetails.userImageUrl && (
                              <img
                                 src={userDetails.userImageUrl}
                                 alt={userDetails.fullName}
                                 className="w-16 h-16 rounded-full object-cover border-2 border-blackberry-color"
                              />
                           )}
                           <div className="flex-1 space-y-2">
                              <p className="text-lg font-semibold">{userDetails.fullName}</p>
                              <p className="text-gray-600">{userDetails.email}</p>
                              <p className="text-gray-600">{userDetails.phoneNo}</p>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Booking Information */}
                  <div className="space-y-4">
                     <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Booking Date:</span>
                        <span className="text-lg font-semibold">{formatDate(booking.date)}</span>
                     </div>
                     <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Day:</span>
                        <span className="text-lg font-semibold capitalize">{booking.day}</span>
                     </div>
                     <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Time Slot:</span>
                        <span className="text-lg font-semibold">
                           {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </span>
                     </div>
                     <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Booked On:</span>
                        <span className="text-lg font-semibold">
                           {formatDate(booking.bookedDate)} at {formatTime(booking.bookedTime)}
                        </span>
                     </div>
                     <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">Booked Day:</span>
                        <span className="text-lg font-semibold capitalize">{booking.bookedDay}</span>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                        <span className="text-gray-600 font-medium">Amount:</span>
                        <span className="text-2xl font-black text-green-color">Rs {booking.amount}</span>
                     </div>
                  </div>
               </div>
            )}

            <button
               onClick={onClose}
               className="mt-6 w-full bg-green-color hover:bg-sgreen-color hover:text-black text-white px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
               Close
            </button>
         </div>
      </Modal>
   );
};

// Owner Booking Card Component
const OwnerBookingCard = ({ booking, onClick }) => {
   const formatTime = (time) => {
      if (!time) return "";
      const timeStr = time.toString();
      const [hours, minutes] = timeStr.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes || 0), 0);
      return format(date, "h:mm a");
   };

   const formatDate = (date) => {
      if (!date) return "";
      const formattedDate = new Date(date);
      return format(formattedDate, "do MMMM yyyy");
   };

   const statusColors = {
      incoming: "from-blue-500 to-blue-600",
      ongoing: "from-green-color to-sgreen-color",
      previous: "from-purple-400 to-purple-500"
   };

   if (!booking) return null;

   return (
      <div
         onClick={onClick}
         className="mt-4 cursor-pointer bg-white/90 backdrop-blur-sm flex-col border-2 border-blackberry-color rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden"
      >
         <div className={`w-full h-2.5 bg-gradient-to-r ${statusColors[booking.status] || "from-purple-400 to-purple-500"}`}></div>
         <div className="p-5 sm:p-6">
            <div className="flex justify-between items-start mb-3">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <h2 className="text-lg sm:text-xl font-semibold text-gray-700">
                        {formatDate(booking.date)}
                     </h2>
                  </div>
                  <p className="text-gray-600 mb-2 capitalize font-medium">{booking.day}</p>
               </div>
               <div className="text-right">
                  <p className="text-2xl font-black text-green-color">Rs {booking.amount}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-color"></div>
                  <p className="text-green-color font-semibold">
                     {formatTime(booking.startTime)}
                  </p>
               </div>
               <span className="text-gray-400">→</span>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <p className="text-red-500 font-semibold">
                     {formatTime(booking.endTime)}
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

// Statistics Card Component
const StatCard = ({ title, value, icon, color = "green-color" }) => {
   const colorClass = color === "green-color" ? "text-green-color" : "text-gray-700";
   return (
      <div className="bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
         <div className="flex items-center justify-between">
            <div>
               <p className="text-gray-600 text-sm sm:text-base mb-2">{title}</p>
               <p className={`text-3xl sm:text-4xl font-black ${colorClass}`}>{value}</p>
            </div>
            {icon && (
               <div className={`${colorClass} text-4xl`}>{icon}</div>
            )}
         </div>
      </div>
   );
};

const OwnerDashboard = () => {
   const [usersCourt, setUsersCourt] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [errorMessage, setErrorMessage] = useState("");
   const token = getToken();

   const decodedToken = getDecodedToken();
   const ownerId = decodedToken?.usersId;
   const navigate = useNavigate();

   const [showLogoutModal, setShowLogoutModal] = useState(false);
   const [bookings, setBookings] = useState([]);
   const [processedBookings, setProcessedBookings] = useState([]);
   const [selectedBooking, setSelectedBooking] = useState(null);
   const [showBookingModal, setShowBookingModal] = useState(false);
   const [userDetails, setUserDetails] = useState(null);
   const [loadingUserDetails, setLoadingUserDetails] = useState(false);

   const [activeTab, setActiveTab] = useState("incoming");
   const [statsFilter, setStatsFilter] = useState("daily");
   const [statsData, setStatsData] = useState(null);
   const [loadingStats, setLoadingStats] = useState(false);

   // Date inputs for stats
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   const [selectedWeek, setSelectedWeek] = useState(getWeekNumber(new Date()));
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

   function getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
   }

   const handleLogout = async () => {
      setShowLogoutModal(true);
   };

   const confirmLogout = () => {
      clearAuth();
      toast.success("Successfully Logged Out!");
      navigate("/auth/login");
   };

   const fetchCourtByOwnerId = async () => {
      setError(false);
      setErrorMessage("");
      try {
         const response = await axios.get(
            `http://localhost:8080/owner/${ownerId}/court`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         setUsersCourt(response.data);
         return response.data;
      } catch (error) {
         setError(true);
         setErrorMessage(error.response?.data?.message || "Error fetching court data");
         console.log("Court not found : ", error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const fetchBookings = async (courtName) => {
      try {
         const response = await axios.get(
            `http://localhost:8080/owner/court/${courtName}/bookings`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         return response.data;
      } catch (error) {
         console.log("Error fetching bookings:", error);
         return [];
      }
   };

   const fetchUserDetails = async (userId) => {
      setLoadingUserDetails(true);
      try {
         const response = await axios.get(
            `http://localhost:8080/auth/userbyid/${userId}`,
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         return response.data;
      } catch (error) {
         console.log("Error fetching user details:", error);
         return null;
      } finally {
         setLoadingUserDetails(false);
      }
   };

   const fetchStats = async (courtId, filterType) => {
      setLoadingStats(true);
      try {
         let url = "";
         switch (filterType) {
            case "daily":
               url = `http://localhost:8080/owner/stats/daily/${courtId}/${selectedDate}`;
               break;
            case "weekly":
               url = `http://localhost:8080/owner/stats/weekly/${courtId}/${selectedYear}/${selectedWeek}`;
               break;
            case "monthly":
               url = `http://localhost:8080/owner/stats/monthly/${courtId}/${selectedYear}/${selectedMonth}`;
               break;
            case "yearly":
               url = `http://localhost:8080/owner/stats/yearly/${courtId}/${selectedYear}`;
               break;
            default:
               return;
         }
         const response = await axios.get(url, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setStatsData(response.data);
      } catch (error) {
         console.log("Error fetching stats:", error);
         setStatsData(null);
      } finally {
         setLoadingStats(false);
      }
   };

   useEffect(() => {
      fetchCourtByOwnerId();
   }, []);

   useEffect(() => {
      const processBookings = async () => {
         if (usersCourt.length > 0) {
            const court = usersCourt[0];
            if (court.courtStatus === "APPROVED" && court.courtName) {
               const fetchedBookings = await fetchBookings(court.courtName);
               setBookings(fetchedBookings);

               // Process bookings to add status
               const processed = fetchedBookings.map((booking) => {
                  let startDate = new Date(booking.date);
                  let endDate = new Date(booking.date);

                  if (booking.startTime < "12:00:00") {
                     startDate.setDate(startDate.getDate() + 1);
                  }

                  if (booking.endTime < booking.startTime) {
                     endDate.setDate(endDate.getDate() + 1);
                  }

                  const start = new Date(
                     `${startDate.toISOString().split("T")[0]}T${booking.startTime}`
                  );
                  const end = new Date(
                     `${endDate.toISOString().split("T")[0]}T${booking.endTime}`
                  );
                  const now = new Date();

                  let status;
                  if (now < start) {
                     status = "incoming";
                  } else if (now >= start && now < end) {
                     status = "ongoing";
                  } else {
                     status = "previous";
                  }

                  return {
                     ...booking,
                     status,
                  };
               });

               setProcessedBookings(processed);
            }
         }
      };
      processBookings();
   }, [usersCourt]);

   useEffect(() => {
      if (usersCourt.length > 0 && usersCourt[0].courtStatus === "APPROVED") {
         const courtId = usersCourt[0].id;
         fetchStats(courtId, statsFilter);
      }
   }, [statsFilter, selectedDate, selectedYear, selectedWeek, selectedMonth, usersCourt]);

   const handleBookingClick = async (booking) => {
      setSelectedBooking(booking);
      setShowBookingModal(true);
      if (booking.users?.usersId) {
         const user = await fetchUserDetails(booking.users.usersId);
         setUserDetails(user);
      }
   };

   const filteredBookings = processedBookings.filter(
      (booking) => booking.status === activeTab
   );

   const sortedBookings = filteredBookings.sort((a, b) => {
      const getTimestamp = (booking) => {
         const date = new Date(booking.date);
         if (booking.startTime < "12:00:00") {
            date.setDate(date.getDate() + 1);
         }
         return new Date(`${date.toISOString().split("T")[0]}T${booking.startTime}`).getTime();
      };
      return getTimestamp(a) - getTimestamp(b);
   });

   if (loading) {
      return <Loading />;
   }

   if (error) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <p className="text-center text-xl text-red-500">Error: {errorMessage}</p>
         </div>
      );
   }

   const court = usersCourt[0];

   if (!court) {
      return (
         <div className="flex flex-col min-h-screen justify-center items-center px-4 sm:px-8 text-balance">
            <div className="bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl p-8 sm:p-12 shadow-xl text-center max-w-2xl">
               <div className="mb-6">
                  <svg className="w-32 h-32 mx-auto text-green-color" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
               </div>
               <p className="text-3xl sm:text-4xl md:text-5xl text-center text-blackberry-color font-black mb-4">
                  Court not found
               </p>
               <p className="text-xl sm:text-2xl text-gray-700 text-center mt-2 mb-6">
                  Add your court to make it live!
               </p>
               <button
                  className="bg-green-color text-white hover:bg-sgreen-color hover:text-black w-48 text-xl rounded-xl border-2 border-blackberry-color p-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                  onClick={() => navigate("/owner/add_court")}
               >
                  Add Court
               </button>
            </div>
         </div>
      );
   }

   if (court.courtStatus === "NOT_APPROVED") {
      return (
         <div className="flex flex-col min-h-screen justify-center items-center text-center text-balance">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 sm:p-12 shadow-xl">
               <div className="mb-6">
                  <svg className="w-24 h-24 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
               </div>
               <h1 className="text-3xl sm:text-4xl mb-4 text-blackberry-color">
                  Your Court has been sent for approval
               </h1>
               <p className="text-lg sm:text-xl text-gray-700">
                  It will take 2-3 days. Thanks for your patience!
               </p>
            </div>
         </div>
      );
   }

   // Calculate total money earned
   const totalMoneyEarned = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

   return (
      <>
         <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
            {/* Header */}
            <div className="mb-8">
               <div className="flex justify-between items-center mb-4">
                  <h1 className="text-3xl sm:text-4xl font-black text-blackberry-color">
                     Dashboard
                  </h1>
                  <button
                     onClick={handleLogout}
                     className="bg-green-color hover:bg-sgreen-color hover:text-black text-white px-4 py-2 text-sm md:text-base rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                     Logout
                  </button>
               </div>
               <p className="text-xl text-gray-600">Welcome back, {court.courtName}!</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
               <StatCard
                  title="Total Money Earned"
                  value={`Rs ${totalMoneyEarned}`}
                  icon="💰"
                  color="green-color"
               />
               <StatCard
                  title="Total Bookings"
                  value={court.totalBookings || bookings.length}
                  icon="📅"
                  color="green-color"
               />
            </div>

            {/* Statistics Filter */}
            <div className="bg-white/90 backdrop-blur-sm border-2 border-blackberry-color rounded-2xl p-6 mb-8 shadow-lg">
               <h2 className="text-2xl font-black text-blackberry-color mb-4">Statistics</h2>
               <div className="flex flex-wrap gap-4 mb-4">
                  <button
                     onClick={() => setStatsFilter("daily")}
                     className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        statsFilter === "daily"
                           ? "bg-green-color text-white"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
                  >
                     Daily
                  </button>
                  <button
                     onClick={() => setStatsFilter("weekly")}
                     className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        statsFilter === "weekly"
                           ? "bg-green-color text-white"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
                  >
                     Weekly
                  </button>
                  <button
                     onClick={() => setStatsFilter("monthly")}
                     className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        statsFilter === "monthly"
                           ? "bg-green-color text-white"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
                  >
                     Monthly
                  </button>
                  <button
                     onClick={() => setStatsFilter("yearly")}
                     className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        statsFilter === "yearly"
                           ? "bg-green-color text-white"
                           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
                  >
                     Yearly
                  </button>
               </div>

               <div className="flex flex-wrap gap-4 mb-4">
                  {statsFilter === "daily" && (
                     <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border-2 border-blackberry-color rounded-lg px-4 py-2"
                     />
                  )}
                  {statsFilter === "weekly" && (
                     <>
                        <input
                           type="number"
                           placeholder="Year"
                           value={selectedYear}
                           onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                           className="border-2 border-blackberry-color rounded-lg px-4 py-2 w-24"
                        />
                        <input
                           type="number"
                           placeholder="Week"
                           value={selectedWeek}
                           onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                           className="border-2 border-blackberry-color rounded-lg px-4 py-2 w-24"
                           min="1"
                           max="52"
                        />
                     </>
                  )}
                  {statsFilter === "monthly" && (
                     <>
                        <input
                           type="number"
                           placeholder="Year"
                           value={selectedYear}
                           onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                           className="border-2 border-blackberry-color rounded-lg px-4 py-2 w-24"
                        />
                        <input
                           type="number"
                           placeholder="Month"
                           value={selectedMonth}
                           onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                           className="border-2 border-blackberry-color rounded-lg px-4 py-2 w-24"
                           min="1"
                           max="12"
                        />
                     </>
                  )}
                  {statsFilter === "yearly" && (
                     <input
                        type="number"
                        placeholder="Year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="border-2 border-blackberry-color rounded-lg px-4 py-2 w-24"
                     />
                  )}
               </div>

               {loadingStats ? (
                  <div className="flex justify-center py-4">
                     <Loading />
                  </div>
               ) : statsData ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 mb-2">Bookings</p>
                        <p className="text-2xl font-black text-green-color">{statsData.totalBookings || 0}</p>
                     </div>
                     <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 mb-2">Money Earned</p>
                        <p className="text-2xl font-black text-green-color">Rs {statsData.moneyEarned || 0}</p>
                     </div>
                  </div>
               ) : (
                  <p className="text-gray-500 text-center py-4">No statistics available</p>
               )}
            </div>

            {/* Bookings Section */}
            <div className="bg-white/50 backdrop-blur-sm border-b-2 border-blackberry-color mb-6">
               <h2 className="text-2xl sm:text-3xl font-black text-blackberry-color mb-4 pt-6 px-4 sm:px-6">
                  All Bookings
               </h2>
               <nav className="flex flex-wrap gap-4 px-4 sm:px-6 pb-4">
                  <button
                     onClick={() => setActiveTab("incoming")}
                     className={`px-4 py-2 text-base sm:text-xl font-semibold transition-all duration-200 rounded-lg ${
                        activeTab === "incoming"
                           ? "bg-blue-500 text-white shadow-lg"
                           : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                     }`}
                  >
                     Incoming Bookings
                  </button>
                  <button
                     onClick={() => setActiveTab("ongoing")}
                     className={`px-4 py-2 text-base sm:text-xl font-semibold transition-all duration-200 rounded-lg ${
                        activeTab === "ongoing"
                           ? "bg-green-color text-white shadow-lg"
                           : "text-gray-700 hover:bg-green-50 hover:text-green-color"
                     }`}
                  >
                     Ongoing Bookings
                  </button>
                  <button
                     onClick={() => setActiveTab("previous")}
                     className={`px-4 py-2 text-base sm:text-xl font-semibold transition-all duration-200 rounded-lg ${
                        activeTab === "previous"
                           ? "bg-purple-500 text-white shadow-lg"
                           : "text-gray-700 hover:bg-purple-100 hover:text-gray-600"
                     }`}
                  >
                     Previous Bookings
                  </button>
               </nav>
            </div>

            {/* Bookings List */}
            <div className="px-4 sm:px-6">
               {sortedBookings.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-xl text-gray-500">
                        No {activeTab} bookings found
                     </p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {sortedBookings.map((booking) => (
                        <OwnerBookingCard
                           key={booking.id}
                           booking={booking}
                           onClick={() => handleBookingClick(booking)}
                        />
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Booking Details Modal */}
         <BookingDetailsModal
            isOpen={showBookingModal}
            onClose={() => {
               setShowBookingModal(false);
               setSelectedBooking(null);
               setUserDetails(null);
            }}
            booking={selectedBooking}
            userDetails={userDetails}
            loading={loadingUserDetails}
         />

         {/* Logout Confirmation Modal */}
         <ConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={confirmLogout}
            title="Logout"
            message="Are you sure you want to logout? You will need to login again to access your account."
            confirmText="Logout"
            cancelText="Cancel"
            isDanger={false}
         />
      </>
   );
};

export default OwnerDashboard;
