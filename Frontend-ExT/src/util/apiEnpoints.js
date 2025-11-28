//base url for api endpoints
export const BASEURL = "http://localhost:8080/api/";  //dummy url for now

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER_INFO: "/user/info",


  GET_ALL_CATEGORIES: "/categories",
  ADD_CATEGORY: "/addcategory",
  GET_ALL_TRANSACTIONS: "/transactions",
  // UPDATE_CATEGORY:"/updatecategory",
  UPDATE_CATEGORY: (categoryId) => `/category/${categoryId}`,


  GET_ALL_INCOME: '/income',
  ADD_INCOME: 'addincome',
  UPDATE_INCOME: (incomeId) => `/income/${incomeId}`,
  DELETE_INCOME: (incomeId) => `/income/${incomeId}`,
  CATEGORY_BY_TYPE: (type) => `category/${type}`,
  INCOME_EXEL_DOWNLAOD: '/excel/download.income',

  
  GET_ALL_EXPENSE: "/expense",
  ADD_EXPENSE: "addexpense",
  UPDATE_EXPENSE: (expId) => `/expense/${expId}`,
  DELETE_EXPENSE: (expId) => `/expense/${expId}`,
  EXPENSE_EXCEL_DOWNLOAD: "/excel/download-expense",


  UPLOAD_IMAGE: "/upload",   //for user profile this is (not billing/valut)
};
