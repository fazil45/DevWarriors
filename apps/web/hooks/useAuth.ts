import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { env } from "../config/env";

interface User {
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      username: string;
      role: "DEVELOPER" | "CREATOR";
    };
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res: User = await axios.get(`${env.BACKEND_URL}/user/me`, {
        withCredentials: true,
      });

      return res.data.user;
    },
    retry: false,
  });
}
