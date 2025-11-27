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


const mockDatabase = {
  GET_ALL_CATEGORIES: [
    { id: 1, userId: "user123", icon: "🍔", name: "Food & Dining", type: "expense" },
    { id: 2, userId: "user123", icon: "🚌", name: "Transport", type: "expense" },
    { id: 3, userId: "user123", icon: "💼", name: "Salary", type: "income" },
    { id: 4, userId: "user123", icon: "🛍️", name: "Shopping", type: "expense" },
    { id: 5, userId: "user123", icon: "📈", name: "Investments", type: "income" },
  ],

  GET_ALL_TRANSACTIONS: [
    {
      id: 101,
      userId: "user123",
      amount: 250,
      categoryId: 1,
      categoryName: "Food & Dining",
      type: "expense",
      icon: "🍔",
      paymentMethod: "UPI",
      date: "2025-01-12",
      notes: "Lunch with friends"
    },
    {
      id: 102,
      userId: "user123",
      amount: 1200,
      categoryId: 4,
      categoryName: "Shopping",
      type: "expense",
      icon: "🛍️",
      paymentMethod: "card",
      date: "2025-02-03",
      notes: "Bought new headphones"
    },
    {
      id: 103,
      userId: "user123",
      amount: 50000,
      categoryId: 3,
      categoryName: "Salary",
      type: "income",
      icon: "💼",
      paymentMethod: "netbanking",
      date: "2025-02-01",
      notes: "Monthly salary credit"
    },
    {
      id: 104,
      userId: "user123",
      amount: 85,
      categoryId: 2,
      categoryName: "Transport",
      type: "expense",
      icon: "🚌",
      paymentMethod: "cash",
      date: "2025-01-20",
      notes: "Bus fare"
    },
    {
      id: 105,
      userId: "user123",
      amount: 3000,
      categoryId: 5,
      categoryName: "Investments",
      type: "income",
      icon: "📈",
      paymentMethod: "netbanking",
      date: "2025-02-10",
      notes: "Stock profit"
    },
    {
      id: 106,
      userId: "user123",
      amount: 480,
      categoryId: 1,
      categoryName: "Food & Dining",
      type: "expense",
      icon: "🍔",
      paymentMethod: "UPI",
      date: "2025-01-28",
      notes: "Pizza order"
    },
    {
      id: 107,
      userId: "user123",
      amount: 160,
      categoryId: 2,
      categoryName: "Transport",
      type: "expense",
      icon: "🚌",
      paymentMethod: "UPI",
      date: "2025-02-11",
      notes: "Auto rickshaw"
    },
    {
      id: 108,
      userId: "user123",
      amount: 2200,
      categoryId: 4,
      categoryName: "Shopping",
      type: "expense",
      icon: "🛍️",
      paymentMethod: "card",
      date: "2025-01-09",
      notes: "Clothing purchase"
    },
    {
      id: 109,
      userId: "user123",
      amount: 150,
      categoryId: 1,
      categoryName: "Food & Dining",
      type: "expense",
      icon: "🍔",
      paymentMethod: "cash",
      date: "2025-02-15",
      notes: "Tea & snacks"
    },
    {
      id: 110,
      userId: "user123",
      amount: 10000,
      categoryId: 5,
      categoryName: "Investments",
      type: "income",
      icon: "📈",
      paymentMethod: "netbanking",
      date: "2025-01-18",
      notes: "Mutual fund withdrawal"
    },
    {
      id: 111,
      userId: "user123",
      amount: 320,
      categoryId: 2,
      categoryName: "Transport",
      type: "expense",
      icon: "🚌",
      paymentMethod: "card",
      date: "2025-02-05",
      notes: "Uber ride"
    },
    {
      id: 112,
      userId: "user123",
      amount: 580,
      categoryId: 1,
      categoryName: "Food & Dining",
      type: "expense",
      icon: "🍔",
      paymentMethod: "UPI",
      date: "2025-02-14",
      notes: "Valentine's dinner"
    },
    {
      id: 113,
      userId: "user123",
      amount: 750,
      categoryId: 4,
      categoryName: "Shopping",
      type: "expense",
      icon: "🛍️",
      paymentMethod: "UPI",
      date: "2025-01-15",
      notes: "Gift for friend"
    },
    {
      id: 114,
      userId: "user123",
      amount: 200,
      categoryId: 1,
      categoryName: "Food & Dining",
      type: "expense",
      icon: "🍔",
      paymentMethod: "cash",
      date: "2025-01-11",
      notes: "Breakfast"
    },
    {
      id: 115,
      userId: "user123",
      amount: 3600,
      categoryId: 5,
      categoryName: "Investments",
      type: "income",
      icon: "📈",
      paymentMethod: "netbanking",
      date: "2025-02-02",
      notes: "Crypto gain"
    }
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
