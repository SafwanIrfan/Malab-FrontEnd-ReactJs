import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { getToken } from "../utils/authToken";

export const URL_CONFIG = {
   BASE_URL: "http://localhost:8080",
};

export const fetchCourts = async ({ query }: { query: string }) => {
   console.log("QUERY : ", query);
   const endPoint = query
      ? `${URL_CONFIG.BASE_URL}/user/search/court?keyword=${encodeURIComponent(
           query
        )}`
      : `${URL_CONFIG.BASE_URL}/courts`;

   const response = await axios.get(endPoint, {
      headers: {
         Authorization: `Bearer ${getToken()}`,
         "Content-Type": "application/json",
      },
   });

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
         "Content-Type": "application/json",
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

export const fetchCourtById = (id: number, token: string) => {
   return useQuery({
      queryKey: ["court", id],
      queryFn: () =>
         axios
            .get(`${URL_CONFIG.BASE_URL}/court/${id}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })
            .then((res) => res.data),
      enabled: !!id,
   });
};
