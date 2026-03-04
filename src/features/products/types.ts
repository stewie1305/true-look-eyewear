import type { BaseFilterParams } from "@/shared/types";

export interface Brand {
  id: string;
  name: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  status: string;
}

export interface VariantImage {
  id: string;
  variant_id: string;
  path: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  path: string;
  is_primary?: boolean;
  status?: string;
}

export interface FrameSpec {
  id: string;
  product_id: string;
  type: string;
  material: string;
  a: number;
  b: number;
  dbl: number;
  shape: string;
  weight: number;
  status: string;
}

export interface RxLensFeature {
  id: string;
  rx_lens_id: string;
  name: string;
  description: string;
  status: string;
}

export interface RxLensSpec {
  id: string;
  product_id: string;
  type: string;
  material: string;
  lens_width: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  status: string;
  features: RxLensFeature[];
}

export interface ContactLensSpec {
  id: string;
  product_id: string;
  base_curve: number;
  diameter: number;
  min_sphere: number;
  max_sphere: number;
  min_cylinder: number;
  max_cylinder: number;
  status: string;
}

export interface ProductSpecs {
  frame_specs: FrameSpec[];
  rx_lens_specs: RxLensSpec[];
  contact_lens_specs: ContactLensSpec[];
}

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
  brand: Brand;
  categories: Category[];
  images?: ProductImage[];
  specs: ProductSpecs;
}

// Product Variant interface - what API actually returns
export interface ProductVariant {
  id: string;
  product_id: string;
  code: string;
  name: string;
  price: string;
  color: string;
  quantity: number;
  description: string;
  create_at: string;
  update_at: string | null;
  status: string;
  product: Product;
  images: VariantImage[];
}
export interface CreateProductDto {
  product_id: string;
  code: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  description: string;
  status: string;
}

export interface UpdateProductDto {
  product_id: string;
  code: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  description: string;
  status: string;
}

export interface ProductFilterParams extends BaseFilterParams {
  product_type?: string;
  brand_name?: string;
  category_name?: string;
  min_price?: number;
  max_price?: number;
  brand_id?: string;
  category_id?: string;
  status?: string;
  search?: string;
}
