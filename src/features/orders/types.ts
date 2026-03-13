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
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  price: number;
  quantity: number;
  variant_name?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface CreateOrderDto {
  customer_id: string;
  extra_fee: number;
  cart_item_ids?: string[];
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
