import axios from "axios";

//  Mock Mode — remove this when backend is ready
const MOCK_MODE = true;

const axiosConfig = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Endpoints that do not need authentication
const excludeEndopoints = ["/login", "/signup", "/status", "/activate", "/health"];

//  MOCK INTERCEPTOR — returns success for ANY request
if (MOCK_MODE) {
  axiosConfig.interceptors.request.use((config) => {
    console.log(" Mock Request:", config.url);

    // Instead of sending request to backend, we generate a fake response
    config.adapter = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: { message: "Mock success response", success: true },
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        }, 300); // simulate network delay
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
