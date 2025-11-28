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
  GET_ALL_INCOME: [
    { id: 1, name: "Salary", date: "2025-01-12", amount: 50000, categoryId: 3, icon: "💼" },
    { id: 2, name: "Freelancing", date: "2025-01-24", amount: 15000, categoryId: 3, icon: "🛍️" },
    { id: 3, name: "Investment Return", date: "2025-01-05", amount: 8000, categoryId: 5, icon: "📈" },
    { id: 4, name: "Salary", date: "2025-02-12", amount: 50000, categoryId: 3, icon: "💼" },
    { id: 5, name: "Rental Income", date: "2025-01-10", amount: 12000, categoryId: 5, icon: "🏠" },
    { id: 6, name: "Freelancing", date: "2025-02-02", amount: 20000, categoryId: 3, icon: "🛍️" },
    { id: 7, name: "Gift", date: "2025-01-18", amount: 5000, categoryId: 5, icon: "🎁" },
    { id: 8, name: "Business Profit", date: "2025-02-05", amount: 18000, categoryId: 5, icon: "📈" },
    { id: 9, name: "Salary", date: "2025-02-12", amount: 50000, categoryId: 3, icon: "💼" },
    { id: 10, name: "Freelancing", date: "2025-02-24", amount: 15000, categoryId: 3, icon: "🛍️" }
  ],

  LOGIN: [{ token: "mock-token", user: { name: "Lucario" } }, { token: "ajbadubc", name }],
  REGISTER: { success: true },
};

////DONT WORRY FOR THE CODE BELOW THIS ->LETS TAKE CARE ONCE WE GET THE ACTUAl ENDPOINTS
//  MOCK INTERCEPTOR — returns data based on endpoint
// if (MOCK_MODE) {
//   axiosConfig.interceptors.request.use((config) => {
//     console.log(" MOCK API HIT:", config.url);

//     // REPLACE real network call with a dummy adapter
//     config.adapter = () => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           const endpointKey = Object.keys(API_ENDPOINTS).find((key) =>
//             config.url.includes(API_ENDPOINTS[key])
//           );

//           resolve({
//             data: mockDatabase[endpointKey] || { success: true },
//             status: 200,
//             statusText: "OK",
//             headers: {},
//             config,
//           });
//         }, 300);
//       });
//     };

//     return config;
//   });
// }



// Helper to deep clone always
const clone = (data) => JSON.parse(JSON.stringify(data));

// -------------------------------------------------
// MOCK INTERCEPTOR
// -------------------------------------------------
if (MOCK_MODE) {
  axiosConfig.interceptors.request.use((config) => {

    config.adapter = () => {
      return new Promise((resolve) => {
        setTimeout(() => {

          // -----------------------------------------------------------------
          // 1️⃣ CATEGORY_BY_TYPE → GET /category/income or /category/expense
          // -----------------------------------------------------------------
          if (config.url.includes("category/") && isNaN(config.url.split("category/")[1])) {

            const type = config.url.split("category/")[1];

            const filtered = mockDatabase.GET_ALL_CATEGORIES.filter(
              (cat) => cat.type === type
            );

            return resolve({
              data: clone(filtered),
              status: 200,
              config,
            });
          }

          // -----------------------------------------------------------------
          // 2️⃣ UPDATE_CATEGORY → PUT /category/:id
          // -----------------------------------------------------------------
          if (/category\/\d+$/.test(config.url) && config.method === "put") {

            const categoryId = Number(config.url.split("category/")[1]);
            const updatedData = JSON.parse(config.data);

            const idx = mockDatabase.GET_ALL_CATEGORIES.findIndex(cat => cat.id === categoryId);

            if (idx !== -1) {
              mockDatabase.GET_ALL_CATEGORIES[idx] = {
                ...mockDatabase.GET_ALL_CATEGORIES[idx],
                ...updatedData,
              };
            }

            return resolve({
              data: clone({ success: true, updated: mockDatabase.GET_ALL_CATEGORIES[idx] }),
              status: 200,
              config,
            });
          }

          // -----------------------------------------------------------------
          // 3️⃣ ADD_CATEGORY → POST /addcategory
          // -----------------------------------------------------------------
          if (config.url.includes("addcategory") && config.method === "post") {

            const newCatData = JSON.parse(config.data);

            const newId =
              mockDatabase.GET_ALL_CATEGORIES.length > 0
                ? Math.max(...mockDatabase.GET_ALL_CATEGORIES.map(c => c.id)) + 1
                : 1;

            const newCategory = {
              id: newId,
              userId: "user123",
              ...newCatData,
            };

            mockDatabase.GET_ALL_CATEGORIES.push(newCategory);

            return resolve({
              data: clone({ success: true, added: newCategory }),
              status: 201,
              config,
            });
          }

          // -----------------------------------------------------------------
          // 4️⃣ ADD_INCOME → POST /addincome
          // -----------------------------------------------------------------
          if (config.url.includes("addincome") && config.method === "post") {
            const incomeData = JSON.parse(config.data);

            const newId =
              mockDatabase.GET_ALL_INCOME.length > 0
                ? Math.max(...mockDatabase.GET_ALL_INCOME.map((i) => i.id)) + 1
                : 1;

            const newIncome = { id: newId, ...incomeData };

            mockDatabase.GET_ALL_INCOME.push(newIncome);

            return resolve({
              data: clone({ success: true, added: newIncome }),
              status: 201,
              config,
            });
          }

          // -----------------------------------------------------------------
          // 5️⃣ DELETE_INCOME → DELETE /income/:id
          // -----------------------------------------------------------------
          if (/\/income\/\d+$/.test(config.url) && config.method === "delete") {

            const incomeId = Number(config.url.split("income/")[1]);

            mockDatabase.GET_ALL_INCOME = mockDatabase.GET_ALL_INCOME.filter(
              (inc) => inc.id !== incomeId
            );

            return resolve({
              data: clone({ success: true }),
              status: 200,
              config,
            });
          }

          // -----------------------------------------------------------------
          // 6️⃣ UPDATE_INCOME → PUT /income/:id
          // -----------------------------------------------------------------
          if (/income\/\d+$/.test(config.url) && config.method === "put") {

            const incomeId = Number(config.url.split("income/")[1]);
            const updated = JSON.parse(config.data);

            const idx = mockDatabase.GET_ALL_INCOME.findIndex(inc => inc.id === incomeId);

            if (idx !== -1) {
              mockDatabase.GET_ALL_INCOME[idx] = {
                ...mockDatabase.GET_ALL_INCOME[idx],
                ...updated,
              };
            }

            return resolve({
              data: clone({ success: true, updated: mockDatabase.GET_ALL_INCOME[idx] }),
              status: 200,
              config,
            });
          }

          // -----------------------------------------------------------------
          // 7️⃣ NORMAL ENDPOINTS → GET_ALL_CATEGORIES, GET_ALL_INCOME, ETC
          // -----------------------------------------------------------------
          const endpointKey = Object.keys(API_ENDPOINTS).find((key) =>
            config.url.includes(
              typeof API_ENDPOINTS[key] === "function"
                ? API_ENDPOINTS[key]("")
                : API_ENDPOINTS[key]
            )
          );

          return resolve({
            data: clone(mockDatabase[endpointKey] ?? { success: true }),
            status: 200,
            config,
          });

        }, 250);
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
