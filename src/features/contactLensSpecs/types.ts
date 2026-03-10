import type { BaseFilterParams } from "@/shared/types";

/**
 * Contact Lens Specification entity
 * Đại diện cho thông số kỹ thuật của kính áp tròng
 */
export interface ContactLensSpec {
  id: string;
  product_id: string;
  base_curve: number; // Độ cong gốc
  diameter: number; // Đường kính
  min_sphere: number; // Độ cầu tối thiểu
  max_sphere: number; // Độ cầu tối đa
  min_cylinder: number; // Độ trụ tối thiểu
  max_cylinder: number; // Độ trụ tối đa
  axis_min: number; // Trục tối thiểu (được lấy từ ContactLensAxis)
  status: string;
}

/**
 * Product detail trong response
 */
export interface Product {
  id: string;
  code: string;
  name: string;
  product_type: string;
  description: string;
  create_at: string;
  update_at: string | null;
  status: string;
  brand_id: string;
}

/**
 * Contact Lens Spec Response với thông tin product
 */
export interface ContactLensSpecResponse {
  id: string;
  product_id: string;
  base_curve: number;
  diameter: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  axis_min: number;
  status: string;
  product: Product;
}

/**
 * DTO để tạo Contact Lens Spec mới
 * axis_min được chọn từ danh sách axis_value có sẵn trong ContactLensAxis
 */
export interface CreateContactLensSpecDto {
  product_id: string;
  base_curve: number;
  diameter: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  axis_min: number; // Được chọn từ ContactLensAxis
  status?: string;
}

/**
 * DTO để cập nhật Contact Lens Spec
 * Tất cả các field đều optional
 */
export interface UpdateContactLensSpecDto {
  product_id?: string;
  base_curve?: number;
  diameter?: number;
  min_sphere?: number;
  max_sphere?: number;
  min_cylinder?: number;
  max_cylinder?: number;
  axis_min?: number;
  status?: string;
}

/**
 * Filter params cho Contact Lens Specs
 * Extends BaseFilterParams (page, limit, sort)
 */
export interface ContactLensSpecFilterParams extends BaseFilterParams {
  search?: string;
  status?: string;
  product_id?: string;
  min_base_curve?: number;
  max_base_curve?: number;
  min_diameter?: number;
  max_diameter?: number;
}
