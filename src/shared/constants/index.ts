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
  RX_LENS_SPECS: {
    BASE: "/rx-lens-specs",
  },
  CONTACT_LENS_AXIS: {
    BASE: "/contact-lens-axis",
  },
  CONTACT_LENS_SPECS: {
    BASE: "/contact-lens-specs",
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
  USERS: {
    BASE: "/users",
    ME: "/users/me",
    STAFF: "/users/staff",
  },
  ADDRESSES: {
    BASE: "/api/addresses",
  },
  USER_ROLES: {
    BASE: "/user-roles",
    USER: (userId: string) => `/user-roles/user/${userId}`,
    SYNC: (userId: string) => `/user-roles/${userId}/sync`,
    REMOVE: (userId: string, roleId: string) =>
      `/user-roles/${userId}/${roleId}`,
  },
  ROLES: {
    BASE: "/roles",
  },
  PROMOTIONS: {
    BASE: "/promotions",
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
  RX_LENS_SPECS: ["rx-lens-specs"],
  RX_LENS_SPEC_DETAIL: (id: string) => ["rx-lens-specs", id],
  CONTACT_LENS_AXIS: ["contact-lens-axis"],
  CONTACT_LENS_AXIS_DETAIL: (id: string) => ["contact-lens-axis", id],
  CONTACT_LENS_SPECS: ["contact-lens-specs"],
  CONTACT_LENS_SPEC_DETAIL: (id: string) => ["contact-lens-specs", id],
  CART: ["cart"],
  CART_ITEMS: ["cart-items"],
  USERS: ["users"],
  USER_DETAIL: (id: string) => ["users", id],
  ADDRESSES: ["addresses"],
  USER_ROLES: ["user-roles"],
  ROLES: ["roles"],
  ROLE_DETAIL: (id: string) => ["roles", id],
  PROMOTIONS: ["promotions"],
  PROMOTION_DETAIL: (id: string) => ["promotions", id],
};
