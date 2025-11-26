import axios from "axios";
import { API_ENDPOINTS } from "./apiEnpoints"; 


// Toggle mock mode (keep true during frontend dev)
export const MOCK_MODE = true;   //to be switched off while integrating backend

// Base Axios instance
const axiosConfig = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


  //  MOCK DATA FOR SPECIFIC ENDPOINTS
const mockDatabase = {
  GET_ALL_CATEGORIES: [
    { id: 1, userId: "user123", icon: "🍔", name: "Food & Dining", type: "expense" },
    { id: 2, userId: "user123", icon: "🚌", name: "Transport", type: "expense" },
    { id: 3, userId: "user123", icon: "💼", name: "Salary", type: "income" },
    { id: 4, userId: "user123", icon: "🛍️", name: "Shopping", type: "expense" },
    { id: 5, userId: "user123", icon: "📈", name: "Investments", type: "income" },
  ],
  LOGIN: { token: "mock-token", user: { name: "Lucario" } },
  REGISTER: { success: true },
};


  //  MOCK INTERCEPTOR — returns data based on endpoint
if (MOCK_MODE) {
  axiosConfig.interceptors.request.use((config) => {
    console.log(" MOCK API HIT:", config.url);

    // REPLACE real network call with a dummy adapter
    config.adapter = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const endpointKey = Object.keys(API_ENDPOINTS).find((key) =>
            config.url.includes(API_ENDPOINTS[key])
          );

          resolve({
            data: mockDatabase[endpointKey] || { success: true },
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        }, 300);
      });
    };

    return config;
  });
}

////actual config to be written yet
// //request interceptor to add auth token to headers
// axiosConfig.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token && !excludeEndopoints.includes(config.url)) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// });

export default axiosConfig;
