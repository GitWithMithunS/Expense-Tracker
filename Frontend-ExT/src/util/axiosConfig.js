import axios from 'axios';

const axiosConfig = axios.create({
    //url provided by our backend team for expense tracker api
    baseURL: "",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
})

//list of endpoints that do not require authentication
const excludeEndopoints = ['/login', '/signup', '/status' , 'activate' , '/health'];

// //request interceptor to add auth token to headers
// axiosConfig.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token && !excludeEndopoints.includes(config.url)) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// });
export default axiosConfig;