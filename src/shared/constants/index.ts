export const API_ENDPOINTS = {
  //
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  PRODUCTS: {
    BASE: "/product-variants",
  },
  BRANDS: {
    BASE: "/brands",
  },
};

export const QUERY_KEYS = {
  PRODUCTS: ["products"],
  PRODUCT_DETAIL: (id: string) => ["products", id],
  BRANDS: ["brands"],
  BRAND_DETAIL: (id: string) => ["brands", id],
};
