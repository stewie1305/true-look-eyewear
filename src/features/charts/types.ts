export interface SupersetChart {
  id: number;
  chart_title: string;
  viz_type?: string;
  description?: string;
  datasource_id?: number;
  datasource_type?: string;
  created_on?: string;
  changed_on?: string;
}

export interface SupersetChartData {
  id: number;
  data?: unknown;
  query_context?: unknown;
  [key: string]: unknown;
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  isFree?: boolean;
}

export interface AnalyzeChartsDto {
  model: string;
  chartIds: number[];
}

export interface AnalyzeChartsResponse {
  analysis: string;
  charts?: SupersetChart[];
  model?: string;
  createdAt?: string;
}
