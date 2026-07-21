    import { useQuery } from "@tanstack/react-query";
    import axios from "axios";
    import { env } from "../config/env";

    export function useCurrentUser() {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
        const res = await axios.get(`${env.BACKEND_URL}/user/me`, {
            withCredentials: true,
        });

        return res.data.user;
        },
        retry: false,
    });
    }
