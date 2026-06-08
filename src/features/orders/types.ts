import type { BaseFilterParams } from "@/shared/types";

export type OrderStatus =
  | "Pending"
  | "Confirm"
  | "Shipping"
  | "Cancel"
  | "Completed";

export interface Order {
  id: string;
  customer_id: string;
  total: number;
  extra_fee: number;
  status: OrderStatus | string;
  create_at: string;
  update_at?: string | null;
  ref_id?: string;
  customer?: {
    id: string;
    fullName: string;
    email: string;
    addresses?: Array<{
      id: string;
      street: string;
      ward: string;
      district: string;
      city: string;
      name_recipient: string;
      phone_recipient: string;
      ref_id?: string;
    }>;
  };
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  price: number;
  quantity: number;
  variant_name?: string;
  image_path?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  images?: any[];
}

export interface CreateOrderDto {
  customer_id: string;
  extra_fee: number;
  cart_item_ids?: string[];
  ref_id?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderFilterParams extends BaseFilterParams {
  status?: string;
  customer_id?: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}

export interface CancelOrderResponse {
  message: string;
  order: Order;
}
