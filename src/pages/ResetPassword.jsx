import axios from "axios";
import { useState } from "react";

export default function ResetPassword() {
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const phoneNumber = localStorage.getItem("verifiedPhone");

   const resetPassword = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         alert("Passwords do not match");
         return;
      }

      await axios.post(
         "/auth/reset-password",
         { userData.username, newPassword: password },
         {
            headers: { "Content-Type": "application/json" },
         }
      );
      alert("Password reset successful");
      // redirect to login page
   };

   return (
      <form onSubmit={resetPassword}>
         <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
         />
         <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
         />
         <button type="submit">Reset Password</button>
      </form>
   );
}
