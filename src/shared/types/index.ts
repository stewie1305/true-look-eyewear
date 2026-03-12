import type { AxiosInstance } from "axios";

// ─── Pagination ──────────────────────────────────────────
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  currentPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Base filter params ──────────────────────────────────
export interface BaseFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  search?: string;
}

// ─── API Error ───────────────────────────────────────────
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  timestamp?: string;
  path?: string;
}

// ─── Select Option ───────────────────────────────────────
export interface SelectOptions {
  id: string;
  name: string;
}

// ─── User Roles ──────────────────────────────────────────
export type UserRole =
  | "user"
  | "admin"
  | "system_admin"
  | "sales_staff"
  | "operation_staff"
  | "customer"
  | "manager";

export interface BaseServiceConfig<
  TEntity, //type cua entity chinh ( VD: Ritual)
  TCreateDto, // Type cua data khi create
  TUpdateDto, //Type cua data khi update
  TFilterParams, //Type cua filter params//type cua params khi filter/search
> {
  endpoint: string; // BASE url path (VD: /rituals)
  axios?: AxiosInstance; // Optinal: custom axios instance

  getAll?: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>; //tra ra 1 response da dc phan trang
  getById?: (id: string | number) => Promise<TEntity>;
  create?: (data: TCreateDto) => Promise<TEntity>;
  update?: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove?: (id: string | number) => Promise<void>;
  getSelectOptions?: () => Promise<SelectOptions[]>;
}

export interface BaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  getAll: (params?: TFilterParams) => Promise<PaginatedResponse<TEntity>>;
  getById: (id: string | number) => Promise<TEntity>;
  create: (data: TCreateDto) => Promise<TEntity>;
  update: (id: string | number, data: TUpdateDto) => Promise<TEntity>;
  remove: (id: string | number) => Promise<void>;
  getSelectOptions: () => Promise<SelectOptions[]>;
}
