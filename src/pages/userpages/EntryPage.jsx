import { useEffect, useState } from "react";
import { getDecodedToken, getToken } from "../../utils/authToken";
import Loading from "../../smallcomponents/Loading";

const EntryPage = () => {
   const token = getToken();

   const decodedToken = getDecodedToken();

   const [loading, setLoading] = useState(true);

   useEffect(() => {
      checkUrl();
   }, []);

   const checkUrl = () => {
      if (token?.split(".")?.length !== 3) {
         window.location.href = "/auth/login";
      } else {
         if (decodedToken.role === "ROLE_USER") {
            window.location.href = "/user";
         } else if (decodedToken.role === "ROLE_ADMIN") {
            window.location.href = "/admin";
         } else {
            window.location.href = "/owner/dashboard";
         }
      }
      setLoading(false);
   };

   if (loading) {
      return <Loading />;
   }
};

export default EntryPage;
