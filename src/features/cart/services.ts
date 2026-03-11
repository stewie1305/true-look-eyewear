import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";
import type {
  CartItem,
  AddToCartDto,
  UpdateCartItemDto,
  MyCartResponse,
} from "./types";


export const cartItemService = {
 
  add: async (data: AddToCartDto): Promise<CartItem> => {
    const response = await apiClient.post(API_ENDPOINTS.CART_ITEMS.ADD, data);
    return response as unknown as CartItem;
  },

  getMyItems: async (): Promise<CartItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.CART_ITEMS.MY_ITEMS);
    return response as unknown as CartItem[];
  },


  update: async (id: string, data: UpdateCartItemDto): Promise<CartItem> => {
    const response = await apiClient.patch(
      API_ENDPOINTS.CART_ITEMS.UPDATE(id),
      data,
    );
    return response as unknown as CartItem;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.CART_ITEMS.REMOVE(id));
  },
};


export const cartService = {
  
  getMyCart: async (): Promise<MyCartResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.CART.MY_CART);
    return response as unknown as MyCartResponse;
  },
};
