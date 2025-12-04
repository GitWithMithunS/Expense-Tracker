// //base url for api endpoints
// export const BASEURL = "http://localhost:8080/api/";  //dummy url for now

// export const API_ENDPOINTS = {
//   LOGIN: "/login",
//   REGISTER: "/register",
//   GET_USER_INFO: "/user/info",


//   GET_ALL_CATEGORIES: "/categories",
//   ADD_CATEGORY: "/addcategory",
//   GET_ALL_TRANSACTIONS: "/transactions",
//   // UPDATE_CATEGORY:"/updatecategory",
//   UPDATE_CATEGORY: (categoryId) => `/category/${categoryId}`,


//   GET_ALL_INCOME: '/income',
//   ADD_INCOME: 'addincome',
//   UPDATE_INCOME: (incomeId) => `/income/${incomeId}`,
//   DELETE_INCOME: (incomeId) => `/income/${incomeId}`,
//   CATEGORY_BY_TYPE: (type) => `category/${type}`,
//   INCOME_EXEL_DOWNLAOD: '/excel/download.income',


//   GET_ALL_EXPENSE: "/expense",
//   ADD_EXPENSE: "addexpense",
//   UPDATE_EXPENSE: (expId) => `/expense/${expId}`,
//   DELETE_EXPENSE: (expId) => `/expense/${expId}`,
//   EXPENSE_EXCEL_DOWNLOAD: "/excel/download-expense",


//   UPLOAD_IMAGE: "/upload",   //for user profile this is (not billing/valut)

//   GET_BUDGET_DATA: "/budgetdata", //this is to fetch budget data

// };


export const BASEURL = "http://localhost:8080";
export const API_ENDPOINTS = {
  // ---------------- AUTH ----------------
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",

  // ---------------- USER PROFILE ----------------
  // Auth service creates profile automatically
  CREATE_USER: "/users", // PUT for update
  GET_USER: (userId) => `/users/${userId}`,

  // ---------------- CATEGORIES ----------------
  CREATE_CATEGORY: "/api/categories", // POST
  GET_ALL_CATEGORIES: "/api/categories", // GET
  UPDATE_CATEGORY: (id) => `/api/categories/${id}`,  // PUT
  DELETE_CATEGORY: (id) => `/api/categories/${id}`,  // DELETE

  // ---------------- TRANSACTIONS ----------------
  ADD_TRANSACTION: "/transactions", // POST
  GET_ALL_TRANSACTIONS: "/transactions", // if needed (not in demo but exists in backend)
  // FILTER_TRANSACTIONS: (type) => `/transactions/filter?type=${type}`, // GET
  FILTER_TRANSACTIONS: "/transactions/filter", // <-- FIXED  
  MONTHLY_SUMMARY: (year) => `/transactions/summary/monthly?year=${year}`,
  CATEGORY_SUMMARY: "/transactions/summary/by-category",


  // ---------------- NOTIFICATIONS ----------------
  GET_NOTIFICATIONS: "/notifications", // GET
  MARK_ALL_READ: "/notifications/read-all", // PATCH
  DELETE_NOTIFICATIONS: (id) => `/notifications/${id}`,  //delete
  DELETE_ALL_NOTIFICATIONS: '/notifications/delete-all',

  // // ---------------- SUBSCRIPTIONS ----------------
  // GET_DEFAULT_PLANS: "/subscriptions/plans/default", // GET
  // ADD_SUBSCRIPTION: "/subscriptions/add", // POST
  // ---------------- SUBSCRIPTIONS ----------------
  GET_DEFAULT_PLANS: "/subscriptions/plans/default",
  ADD_SUBSCRIPTION: "/subscriptions/add",
  GET_USER_SUBSCRIPTIONS: "/subscriptions/user",
  DELETE_SUBSCRIPTION: (id) => `/subscriptions/${id}`,
  


  // ---------------- VAULT (Bills Upload/Download/Delete) ----------------
  UPLOAD_BILL: "/api/v1/vault/upload", // POST (multipart/form-data)
  LIST_BILLS: "/api/v1/bills", // GET
  DOWNLOAD_BILL: (id) => `/api/v1/vault/files/${id}`, // GET (binary)
  DELETE_BILL: (id) => `/api/v1/vault/${id}`, // DELETE
};
