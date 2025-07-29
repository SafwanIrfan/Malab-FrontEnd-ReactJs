import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const jwtToken = localStorage?.getItem("token");

export const URL_CONFIG = {
   BASE_URL: "http://localhost:8080",
   headers: {
      Type: "application/json",
      Authorization: `Bearer ${jwtToken}`,
   },
};

export const fetchCourts = async ({ query }: { query: string }) => {
   console.log("QUERY : ", query);
   const endPoint = query
      ? `${URL_CONFIG.BASE_URL}/search/court?keyword=${encodeURIComponent(
           query
        )}`
      : `${URL_CONFIG.BASE_URL}/courts`;

   const response = await axios.get(endPoint);

   if (!response) {
      throw new Error(`Failed to fetch courts`);
   }

   const courts = await response.data;
   return courts;
};

export const loginUser = async (credentials: { credentials: {} }) => {
   const endPoint = `${URL_CONFIG.BASE_URL}/auth/login`;
   console.log(credentials);
   const response = await axios.post(endPoint, credentials, {
      headers: {
         "Content-Type": URL_CONFIG.headers.Type,
      },
   });

   console.log(response);

   if (!response) {
      throw new Error(`Invalid username or password`);
   }
   return response.data;
};

export const fetchUserDetails = (username: string) => {
   return useQuery({
      queryKey: ["user", username],
      queryFn: () => axios.get(`${URL_CONFIG.BASE_URL}/auth/user/${username}`),
      enabled: false,
   });
};
