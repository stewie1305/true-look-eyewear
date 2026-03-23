import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { supersetChartService, aiSupersetService } from "../services";
import type { AnalyzeChartsDto } from "../types";

export function useCharts() {
  return useQuery({
    queryKey: QUERY_KEYS.SUPERSET_CHARTS,
    queryFn: () => supersetChartService.getCharts(),
  });
}

export function useChartData(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.SUPERSET_CHART_DATA(id!),
    queryFn: () => supersetChartService.getChartData(id!),
    enabled: id !== null && id !== undefined,
  });
}

export function useAIModels() {
  return useQuery({
    queryKey: QUERY_KEYS.AI_SUPERSET_MODELS,
    queryFn: () => aiSupersetService.getModels(),
  });
}

export function useAnalyzeCharts() {
  return useMutation({
    mutationFn: (dto: AnalyzeChartsDto) => aiSupersetService.analyzeCharts(dto),
    onSuccess: () => {
      toast.success("Phân tích AI hoàn tất!");
    },
    onError: () => {
      toast.error("Phân tích thất bại. Vui lòng thử lại.");
    },
  });
}
