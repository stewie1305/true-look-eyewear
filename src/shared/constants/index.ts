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
  CATEGORIES: {
    BASE: "/categories",
  },
  FRAME_SPECS: {
    BASE: "/frame-spec",
  },
  CART: {
    BASE: "/carts",
    MY_CART: "/carts/my-cart",
  },
  CART_ITEMS: {
    BASE: "/cart-items",
    ADD: "/cart-items/add",
    MY_ITEMS: "/cart-items/my-items",
    UPDATE: (id: string) => `/cart-items/update/${id}`,
    REMOVE: (id: string) => `/cart-items/remove/${id}`,
  },
};

export const QUERY_KEYS = {
  PRODUCTS: ["products"],
  PRODUCT_DETAIL: (id: string) => ["products", id],
  BRANDS: ["brands"],
  BRAND_DETAIL: (id: string) => ["brands", id],
  CATEGORIES: ["categories"],
  CATEGORY_DETAIL: (id: string) => ["categories", id],
  FRAME_SPECS: ["frame-specs"],
  FRAME_SPEC_DETAIL: (id: string) => ["frame-specs", id],
  CART: ["cart"],
  CART_ITEMS: ["cart-items"],
};
