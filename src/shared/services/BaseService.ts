import type {
  BaseService,
  BaseServiceConfig,
  PaginatedResponse,
  SelectOptions,
} from "@/shared/types/index";
import apiClient from "@/lib/axios";

export function createBaseService<
  TEntity,
  TCreateDto = Partial<TEntity>, //partial la util cua javascript, cai nay la default value cho generic type
  TUpdateDto = Partial<TEntity>,
  TFilterParams = Record<string, unknown>,
>(
  config: BaseServiceConfig<TEntity, TCreateDto, TUpdateDto, TFilterParams>, // dau vao
): BaseService<TEntity, TCreateDto, TUpdateDto, TFilterParams> {
  // dau ra
  const axios = config.axios ?? apiClient;
  const endpoint = config.endpoint;
  return {
    getAll:
      config.getAll ??
      (async (params?: TFilterParams) => {
        return axios.get<PaginatedResponse<TEntity>>(endpoint, {
          params, // Shorthand: { params: params }
        }) as unknown as Promise<PaginatedResponse<TEntity>>;
      }),
    getById:
      config.getById ??
      (async (id: string | number) => {
        return axios.get<TEntity>(
          `${endpoint}/${id}`,
        ) as unknown as Promise<TEntity>;
      }),
    create:
      config.create ??
      (async (dto: TCreateDto) => {
        return axios.post<TEntity>(
          endpoint,
          dto,
        ) as unknown as Promise<TEntity>;
      }),
    update:
      config.update ??
      (async (id: string | number, dto: TUpdateDto) => {
        return axios.put<TEntity>(
          `${endpoint}/${id}`,
          dto,
        ) as unknown as Promise<TEntity>;
      }),
    remove:
      config.remove ??
      (async (id: string | number) => {
        await axios.delete(`${endpoint}/${id}`);
      }),
    getSelectOptions:
      config.getSelectOptions ??
      (async () => {
        return axios.get<SelectOptions[]>(
          `${endpoint}/select`,
        ) as unknown as Promise<SelectOptions[]>;
      }),
  };
}
