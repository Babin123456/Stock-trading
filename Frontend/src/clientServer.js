import axios from "axios";

const clientServer = axios.create({
    baseURL: (import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:3000",
    withCredentials: true
});

export default clientServer;
