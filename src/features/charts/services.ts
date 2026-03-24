import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type {
  SupersetChart,
  SupersetChartData,
  AIModel,
  AnalyzeChartsDto,
  AnalyzeChartsResponse,
} from "./types";

export const supersetChartService = {
  getCharts: async (): Promise<SupersetChart[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SUPERSET_CHARTS.BASE);
    return response as unknown as SupersetChart[];
  },

  getChartData: async (id: number): Promise<SupersetChartData> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SUPERSET_CHARTS.DATA(id),
    );
    return response as unknown as SupersetChartData;
  },
};

export const aiSupersetService = {
  getModels: async (): Promise<AIModel[]> => {
    const response = await apiClient.get(API_ENDPOINTS.AI_SUPERSET.MODELS);
    return response as unknown as AIModel[];
  },

  analyzeCharts: async (
    dto: AnalyzeChartsDto,
  ): Promise<AnalyzeChartsResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.AI_SUPERSET.ANALYZE,
      dto,
    );
    return response as unknown as AnalyzeChartsResponse;
  },
};
