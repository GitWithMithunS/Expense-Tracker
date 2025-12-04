import axios from "axios";
import { API_ENDPOINTS } from "./apiEnpoints";


// Base Axios instance
const axiosConfig = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


const excludeEndpoints = ['/auth/login', '/auth/register', '/health', '/status']


//actual config to be written yet
//request interceptor to add auth token to headers
axiosConfig.interceptors.request.use(
  (config) => {
    const shouldskipToken = excludeEndpoints.some((endpoints) => {
      config.url?.includes(endpoints)
    });

    if (!shouldskipToken) {
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
    }

    const token = localStorage.getItem('token');
    if (token && !excludeEndpoints.includes(config.url)) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.log('some error occured in the axios response',)
    return Promise.reject((error));
  });

// axiosConfig.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     if (userId) {
//       config.headers["X-User-Id"] = userId;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );



//axios interceptor
axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again later");
      }
    }

    if (error.code === 'ECONNABORTED') {
      console.error("Request timeout. Please try again.");
      console.log('some error occured in the axios request', error)
    }

    return Promise.reject(error);
  })


export default axiosConfig;



// Toggle mock mode (keep true during frontend dev)
export const MOCK_MODE = false;   //to be switched off while integrating backend




//  MOCK DATA FOR SPECIFIC ENDPOINTS
const mockDatabase = {
  GET_ALL_CATEGORIES: [
    { id: 1, userId: "user123", icon: "🍔", name: "Food & Dining", type: "expense" },
    { id: 2, userId: "user123", icon: "🚌", name: "Transport", type: "expense" },
    { id: 3, userId: "user123", icon: "💼", name: "Salary", type: "income" },
    { id: 4, userId: "user123", icon: "🛍️", name: "Shopping", type: "expense" },
    { id: 5, userId: "user123", icon: "📈", name: "Investments", type: "income" },
  ],

  GET_ALL_TRANSACTIONS: [
    { id: 101, userId: "user123", amount: 250, categoryId: 1, categoryName: "Food & Dining", type: "expense", icon: "🍔", paymentMethod: "UPI", date: "2025-01-12", notes: "Lunch with friends" },
    { id: 102, userId: "user123", amount: 1200, categoryId: 4, categoryName: "Shopping", type: "expense", icon: "🛍️", paymentMethod: "card", date: "2025-02-03", notes: "Bought new headphones" },
    { id: 103, userId: "user123", amount: 50000, categoryId: 3, categoryName: "Salary", type: "income", icon: "💼", paymentMethod: "netbanking", date: "2025-02-01", notes: "Monthly salary credit" },
    { id: 104, userId: "user123", amount: 85, categoryId: 2, categoryName: "Transport", type: "expense", icon: "🚌", paymentMethod: "cash", date: "2025-01-20", notes: "Bus fare" },
    { id: 105, userId: "user123", amount: 3000, categoryId: 5, categoryName: "Investments", type: "income", icon: "📈", paymentMethod: "netbanking", date: "2025-02-10", notes: "Stock profit" },
    { id: 106, userId: "user123", amount: 480, categoryId: 1, categoryName: "Food & Dining", type: "expense", icon: "🍔", paymentMethod: "UPI", date: "2025-01-28", notes: "Pizza order" },
    { id: 107, userId: "user123", amount: 160, categoryId: 2, categoryName: "Transport", type: "expense", icon: "🚌", paymentMethod: "UPI", date: "2025-02-11", notes: "Auto rickshaw" },
    { id: 108, userId: "user123", amount: 2200, categoryId: 4, categoryName: "Shopping", type: "expense", icon: "🛍️", paymentMethod: "card", date: "2025-01-09", notes: "Clothing purchase" },
    { id: 109, userId: "user123", amount: 150, categoryId: 1, categoryName: "Food & Dining", type: "expense", icon: "🍔", paymentMethod: "cash", date: "2025-02-15", notes: "Tea & snacks" },
    { id: 110, userId: "user123", amount: 10000, categoryId: 5, categoryName: "Investments", type: "income", icon: "📈", paymentMethod: "netbanking", date: "2025-01-18", notes: "Mutual fund withdrawal" },
    { id: 111, userId: "user123", amount: 320, categoryId: 2, categoryName: "Transport", type: "expense", icon: "🚌", paymentMethod: "card", date: "2025-02-05", notes: "Uber ride" },
    { id: 112, userId: "user123", amount: 580, categoryId: 1, categoryName: "Food & Dining", type: "expense", icon: "🍔", paymentMethod: "UPI", date: "2025-02-14", notes: "Valentine's dinner" },
    { id: 113, userId: "user123", amount: 750, categoryId: 4, categoryName: "Shopping", type: "expense", icon: "🛍️", paymentMethod: "UPI", date: "2025-01-15", notes: "Gift for friend" },
    { id: 114, userId: "user123", amount: 200, categoryId: 1, categoryName: "Food & Dining", type: "expense", icon: "🍔", paymentMethod: "cash", date: "2025-01-11", notes: "Breakfast" },
    { id: 115, userId: "user123", amount: 3600, categoryId: 5, categoryName: "Investments", type: "income", icon: "📈", paymentMethod: "netbanking", date: "2025-02-02", notes: "Crypto gain" }
  ],

  LOGIN: { token: "mock-token", user: { name: "Lucario" } },

  GET_ALL_INCOME: [
    { id: 1, name: "Salary", date: "2025-01-12", amount: 50000, categoryId: 3, categoryName: "Salary", icon: "💼" },
    { id: 2, name: "Freelancing", date: "2025-01-24", amount: 15000, categoryId: 3, categoryName: "Salary", icon: "🛍️" },
    { id: 3, name: "Investment Return", date: "2025-01-05", amount: 8000, categoryId: 5, categoryName: "Investments", icon: "📈" },
    { id: 4, name: "Salary", date: "2025-02-12", amount: 50000, categoryId: 3, categoryName: "Salary", icon: "💼" },
    { id: 5, name: "Rental Income", date: "2025-01-10", amount: 12000, categoryId: 5, categoryName: "Investments", icon: "🏠" },
    { id: 6, name: "Freelancing", date: "2025-02-02", amount: 20000, categoryId: 3, categoryName: "Salary", icon: "🛍️" },
    { id: 7, name: "Gift", date: "2025-01-18", amount: 5000, categoryId: 5, categoryName: "Investments", icon: "🎁" },
    { id: 8, name: "Business Profit", date: "2025-02-05", amount: 18000, categoryId: 5, categoryName: "Investments", icon: "📈" },
    { id: 9, name: "Salary", date: "2025-02-12", amount: 50000, categoryId: 3, categoryName: "Salary", icon: "💼" },
    { id: 10, name: "Freelancing", date: "2025-02-24", amount: 15000, categoryId: 3, categoryName: "Salary", icon: "🛍️" }
  ],

  GET_ALL_EXPENSE: [
    { id: 1, name: "Lunch at Cafe", amount: 350, date: "2025-01-14", categoryId: 1, categoryName: "Food & Dining", icon: "🍔" },
    { id: 2, name: "Bus Ticket", amount: 40, date: "2025-01-16", categoryId: 2, categoryName: "Transport", icon: "🚌" },
    { id: 3, name: "Grocery Shopping", amount: 1800, date: "2025-01-18", categoryId: 4, categoryName: "Shopping", icon: "🛍️" },
    { id: 4, name: "Auto Rickshaw Ride", amount: 120, date: "2025-01-20", categoryId: 2, categoryName: "Transport", icon: "🛺" },
    { id: 5, name: "Dinner Out", amount: 600, date: "2025-01-22", categoryId: 1, categoryName: "Food & Dining", icon: "🍽️" }
  ],

  GET_BUDGET_DATA: {
    userId: "user123",

  // ------------------------
  // 1️⃣ Monthly Budget (Main)
  // ------------------------
  month: "December", totalBudget: 25000, totalSpent: 14550,remainingBudget: 10450,

  // ------------------------
  // 2️⃣ Category-wise Budgets
  // ------------------------
  categories: [
    { categoryId: 1, category: "Food & Dining", icon: "🍔", limit: 5000, spent: 3200 },
    { categoryId: 2, category: "Transport", icon: "🚌", limit: 2000, spent: 1350 },
    { categoryId: 4, category: "Shopping", icon: "🛍️", limit: 7000, spent: 3000 },
    { categoryId: 5, category: "Investments", icon: "📈", limit: 10000, spent: 7500}
  ],

  // ------------------------
  // 3️⃣ Savings Goals
  // ------------------------
  goals: [
    { id: 1, goalName: "Buy New Laptop", target: 80000, saved: 20000, deadline: "2025-06-10", priority: "high" },
    { id: 2, goalName: "Goa Trip", target: 25000, saved: 7000,deadline: "2025-04-20", priority: "medium" },
    { id: 3, goalName: "Emergency Fund", target: 100000, saved: 45000, deadline: null, priority: "low" }
  ],

  // ------------------------
  // 4️⃣ Upcoming Bill Reminders
  // ------------------------
  subscriptions: [
    { id: 1, name: "Electricity Bill", amount: 1200, renewalType: "monthly", startMonth: "2025-12", endMonth: null },
    { id: 2, name: "WiFi Recharge", amount: 899, renewalType: "monthly", startMonth: "2025-12", endMonth: null },
    { id: 3, name: "Credit Card EMI", amount: 4500, renewalType: "monthly", startMonth: "2025-12", endMonth: "2026-03" }
  ]
},

  REGISTER: { success: true },
};


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
          //  CATEGORY_BY_TYPE → GET /category/income or /category/expense
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
          //  UPDATE_CATEGORY → PUT /category/:id
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
          // 3️ADD_CATEGORY → POST /addcategory
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

          // GET_ALL_INCOME → GET /income
          if (config.url === API_ENDPOINTS.GET_ALL_INCOME && config.method === "get") {
            return resolve({
              data: clone(mockDatabase.GET_ALL_INCOME),
              status: 200,
              config,
            });
          }


          // -----------------------------------------------------------------
          //  ADD_INCOME → POST /addincome
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
          //  DELETE_INCOME → DELETE /income/:id
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
          //  UPDATE_INCOME → PUT /income/:id
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

          // -------------------------------------------------
          // GET_ALL_EXPENSE → GET /expense
          // -------------------------------------------------
          if (config.url === API_ENDPOINTS.GET_ALL_EXPENSE && config.method === "get") {
            return resolve({
              data: clone(mockDatabase.GET_ALL_EXPENSE),
              status: 200,
              config,
            });
          }

          // -------------------------------------------------
          // ADD_EXPENSE → POST /addexpense
          // -------------------------------------------------
          if (config.url.includes("addexpense") && config.method === "post") {
            const expense = JSON.parse(config.data);

            const newId =
              mockDatabase.GET_ALL_EXPENSE.length > 0
                ? Math.max(...mockDatabase.GET_ALL_EXPENSE.map((e) => e.id)) + 1
                : 1;

            const newExpense = { id: newId, ...expense };

            mockDatabase.GET_ALL_EXPENSE.push(newExpense);

            return resolve({
              data: clone({ success: true, added: newExpense }),
              status: 201,
              config,
            });
          }

          // -------------------------------------------------
          // DELETE_EXPENSE → DELETE /expense/:id
          // -------------------------------------------------
          if (/\/expense\/\d+$/.test(config.url) && config.method === "delete") {

            const expId = Number(config.url.split("expense/")[1]);

            mockDatabase.GET_ALL_EXPENSE = mockDatabase.GET_ALL_EXPENSE.filter(
              (exp) => exp.id !== expId
            );

            return resolve({
              data: clone({ success: true }),
              status: 200,
              config,
            });
          }

          // -------------------------------------------------
          // UPDATE_EXPENSE → PUT /expense/:id
          // -------------------------------------------------
          if (/expense\/\d+$/.test(config.url) && config.method === "put") {

            const expId = Number(config.url.split("expense/")[1]);
            const updated = JSON.parse(config.data);

            const idx = mockDatabase.GET_ALL_EXPENSE.findIndex(e => e.id === expId);

            if (idx !== -1) {
              mockDatabase.GET_ALL_EXPENSE[idx] = {
                ...mockDatabase.GET_ALL_EXPENSE[idx],
                ...updated,
              };
            }

            return resolve({
              data: clone({ success: true, updated: mockDatabase.GET_ALL_EXPENSE[idx] }),
              status: 200,
              config,
            });
          }


          // -----------------------------------------------------------------
          //  NORMAL ENDPOINTS → GET_ALL_CATEGORIES, GET_ALL_INCOME, ETC
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
    // axiosConfig.post("/signup", form)


    return config;
  });
}




// export default axiosConfig;