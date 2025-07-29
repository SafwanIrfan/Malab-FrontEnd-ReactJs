import { jwtDecode } from "jwt-decode";

interface JwtPayload {
   usersId: number;
   sub: string;
   isVerified: boolean;
   userImageUrl: string;
   role: string;
   exp: number;
   iat: number;
}

export const getToken = (): string | null => {
   return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getUsername = (): string | null => {
   return (
      localStorage.getItem("username") || sessionStorage.getItem("username")
   );
};

export const clearAuth = (): void => {
   localStorage.removeItem("token");
   sessionStorage.removeItem("token");
   localStorage.removeItem("username");
   sessionStorage.removeItem("username");
};

export const getDecodedToken = (): JwtPayload | null => {
   const token = getToken();

   try {
      return token ? jwtDecode<JwtPayload>(token) : null;
   } catch (err) {
      console.log("Invalid token : ", (err as Error).message);
      return null;
   }
};
