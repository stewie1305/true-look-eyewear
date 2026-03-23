import { useState, useMemo } from "react";
import {
  BarChart2,
  Brain,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  Sparkles,
  SquareCheck,
  Square,
} from "lucide-react";

import {
  useCharts,
  useChartData,
  useAIModels,
  useAnalyzeCharts,
} from "../hooks/useCharts";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import type { SupersetChart, AIModel } from "../types";

// Known free Gemini models as fallback labels
const FREE_MODELS: AIModel[] = [
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", isFree: true },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    isFree: true,
  },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", isFree: true },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", isFree: true },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    isFree: true,
  },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", isFree: true },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash 8B",
    isFree: true,
  },
];

const DEFAULT_MODEL = "gemini-2.5-flash";

function isFreeModel(modelId: string) {
  return FREE_MODELS.some((model) =>
    modelId.toLowerCase().includes(model.id.toLowerCase()),
  );
}

function normalizeNameFromId(id: string) {
  return id
    .replace(/^models\//i, "")
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function getChartDisplayName(chart: SupersetChart) {
  const candidate = chart as SupersetChart & {
    name?: string;
    title?: string;
  };
  return (
    candidate.name ||
    candidate.title ||
    chart.chart_title ||
    `Chart ${chart.id}`
  );
}

function getChartVizType(chart: SupersetChart) {
  const candidate = chart as SupersetChart & {
    type?: string;
  };
  return chart.viz_type || candidate.type || undefined;
}

// ---------- Chart Row ----------
function ChartRow({
  chart,
  selected,
  onToggle,
  onPreview,
  previewing,
}: {
  chart: SupersetChart;
  selected: boolean;
  onToggle: (id: number) => void;
  onPreview: (id: number) => void;
  previewing: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors cursor-pointer ${
        selected
          ? "border-primary/60 bg-primary/5"
          : "border-border hover:border-muted-foreground/40 bg-card"
      }`}
      onClick={() => onToggle(chart.id)}
    >
      <div className="text-primary mt-0.5 shrink-0">
        {selected ? (
          <SquareCheck className="h-5 w-5" />
        ) : (
          <Square className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">
          {getChartDisplayName(chart)}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {getChartVizType(chart) && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {getChartVizType(chart)}
            </Badge>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="shrink-0 text-xs"
        onClick={(e) => {
          e.stopPropagation();
          onPreview(chart.id);
        }}
      >
        {previewing ? (
          <ChevronUp className="h-3.5 w-3.5 mr-1" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 mr-1" />
        )}
        Dữ liệu
      </Button>
    </div>
  );
}

// ---------- Chart Data Preview ----------
function ChartDataPreview({ chartId }: { chartId: number }) {
  const { data, isLoading, isError } = useChartData(chartId);

  if (isLoading)
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Đang tải dữ liệu chart...
      </div>
    );

  if (isError)
    return (
      <p className="text-sm text-destructive px-4 py-2">
        Không thể tải dữ liệu chart này.
      </p>
    );

  return (
    <div className="rounded-lg bg-muted/50 border mx-4 mb-3 overflow-auto max-h-48">
      <pre className="text-xs p-3 whitespace-pre-wrap wrap-break-word text-muted-foreground">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

// ---------- Analysis Result ----------
type AnalysisBlock =
  | { type: "h2" | "h3" | "h4"; content: string }
  | { type: "p"; content: string }
  | { type: "list"; items: string[] };

function normalizeAnalysisLine(line: string) {
  return line
    .replace(/^[\s"'“”‘’`]+/, "")
    .replace(/[\s"'“”‘’`]+$/, "")
    .replace(/^\u2022\s*/, "- ");
}

function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`b-${idx}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`t-${idx}`}>{part}</span>;
  });
}

function parseAnalysisBlocks(text: string): AnalysisBlock[] {
  const lines = text
    .replace(/```[\w-]*\n?/g, "")
    .replace(/```/g, "")
    .split("\n");

  const blocks: AnalysisBlock[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: "list", items: currentList });
      currentList = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = normalizeAnalysisLine(rawLine.trim());

    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push({ type: "h4", content: line.slice(4).trim() });
      return;
    }

    if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h3", content: line.slice(3).trim() });
      return;
    }

    if (line.startsWith("# ")) {
      flushList();
      blocks.push({ type: "h2", content: line.slice(2).trim() });
      return;
    }

    if (/^[-*•]\s+/.test(line)) {
      currentList.push(line.replace(/^[-*•]\s+/, "").trim());
      return;
    }

    flushList();
    blocks.push({ type: "p", content: line });
  });

  flushList();
  return blocks;
}

function AnalysisResult({ text }: { text: string }) {
  const blocks = useMemo(() => parseAnalysisBlocks(text), [text]);

  return (
    <div className="rounded-xl border bg-card p-4 md:p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-base">Kết quả phân tích AI</h3>
        </div>
      </div>

      <div className="rounded-lg bg-muted/30 border p-4 max-h-130 overflow-y-auto hide-scrollbar space-y-3">
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có dữ liệu phân tích.
          </p>
        ) : (
          blocks.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="text-lg font-bold tracking-tight pt-1">
                  {renderInlineBold(block.content)}
                </h2>
              );
            }

            if (block.type === "h3") {
              return (
                <h3
                  key={i}
                  className="text-base font-semibold pt-1 text-primary"
                >
                  {renderInlineBold(block.content)}
                </h3>
              );
            }

            if (block.type === "h4")
              return (
                <h4
                  key={i}
                  className="text-sm font-semibold text-foreground/90"
                >
                  {renderInlineBold(block.content)}
                </h4>
              );

            if (block.type === "list") {
              return (
                <ul
                  key={i}
                  className="space-y-2 pl-5 list-disc marker:text-primary"
                >
                  {block.items.map((item, liIdx) => (
                    <li
                      key={liIdx}
                      className="text-sm leading-relaxed text-foreground/95"
                    >
                      {renderInlineBold(item)}
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={i} className="text-sm leading-relaxed text-foreground/90">
                {renderInlineBold(block.content)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}

// ---------- Main Page ----------
export default function ManageChartsPage() {
  const { data: charts = [], isLoading: chartsLoading } = useCharts();
  const { data: modelsRaw, isLoading: modelsLoading } = useAIModels();
  const analyzeMutation = useAnalyzeCharts();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [search, setSearch] = useState("");
  const [previewId, setPreviewId] = useState<number | null>(null);

  const apiModelsSource = useMemo<unknown[]>(() => {
    if (Array.isArray(modelsRaw)) return modelsRaw;

    const payload = modelsRaw as
      | {
          models?: unknown[];
          data?: unknown[];
          items?: unknown[];
        }
      | undefined;

    if (Array.isArray(payload?.models)) return payload.models;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;

    return [];
  }, [modelsRaw]);

  // Merge API models with free-label hints
  const models: AIModel[] = useMemo(() => {
    const mappedApi = apiModelsSource
      .map((model) => {
        if (typeof model === "string") {
          const id = model.trim();
          if (!id) return null;
          return {
            id,
            name: normalizeNameFromId(id),
            isFree: isFreeModel(id),
          } satisfies AIModel;
        }

        if (!model || typeof model !== "object") return null;

        const candidate = model as {
          id?: unknown;
          name?: unknown;
          model?: unknown;
          displayName?: unknown;
          isFree?: boolean;
        };

        const id = String(
          candidate.id ?? candidate.model ?? candidate.name ?? "",
        )
          .trim()
          .replace(/^models\//i, "");

        if (!id) return null;

        const displayName =
          typeof candidate.displayName === "string" &&
          candidate.displayName.trim().length > 0
            ? candidate.displayName
            : typeof candidate.name === "string" &&
                candidate.name.trim().length > 0
              ? candidate.name
              : normalizeNameFromId(id);

        return {
          ...(model as Record<string, unknown>),
          id,
          name: displayName,
          isFree: candidate.isFree ?? isFreeModel(id),
        } satisfies AIModel;
      })
      .filter(Boolean) as AIModel[];

    const unique = new Map<string, AIModel>();

    [...FREE_MODELS, ...mappedApi].forEach((model) => {
      const key = model.id.toLowerCase();
      const existing = unique.get(key);
      unique.set(key, {
        ...existing,
        ...model,
        isFree: model.isFree ?? existing?.isFree ?? isFreeModel(model.id),
      });
    });

    return Array.from(unique.values());
  }, [apiModelsSource]);

  const filteredCharts = useMemo(() => {
    if (!search.trim()) return charts;
    return charts.filter((c) =>
      getChartDisplayName(c).toLowerCase().includes(search.toLowerCase()),
    );
  }, [charts, search]);

  const toggleChart = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredCharts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCharts.map((c) => c.id));
    }
  };

  const handlePreview = (id: number) => {
    setPreviewId((prev) => (prev === id ? null : id));
  };

  const handleAnalyze = () => {
    if (!selectedModel) return;
    if (selectedIds.length === 0) return;
    analyzeMutation.mutate({ model: selectedModel, chartIds: selectedIds });
  };

  const allSelected =
    filteredCharts.length > 0 &&
    filteredCharts.every((c) => selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Chart Analyst</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Chọn các biểu đồ Superset và dùng AI để phân tích, so sánh dữ liệu
          kinh doanh.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Chart List */}
        <div className="xl:col-span-3 space-y-4">
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-sm">
                Danh sách Charts{" "}
                <span className="text-muted-foreground font-normal">
                  ({charts.length})
                </span>
              </h3>
              {charts.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={toggleAll}
                >
                  {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm chart..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* List */}
            <div className="p-2 space-y-1.5 max-h-130 overflow-y-auto hide-scrollbar">
              {chartsLoading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Đang tải charts...</span>
                </div>
              ) : filteredCharts.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Không tìm thấy chart nào.
                </div>
              ) : (
                filteredCharts.map((chart) => (
                  <div key={chart.id}>
                    <ChartRow
                      chart={chart}
                      selected={selectedIds.includes(chart.id)}
                      onToggle={toggleChart}
                      onPreview={handlePreview}
                      previewing={previewId === chart.id}
                    />
                    {previewId === chart.id && (
                      <ChartDataPreview chartId={chart.id} />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Config + Result */}
        <div className="xl:col-span-2 space-y-4">
          {/* Config panel */}
          <div className="rounded-xl border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-violet-500" />
              <h3 className="font-semibold text-sm">Cấu hình phân tích</h3>
            </div>

            {/* Model selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Model AI
              </label>
              <Select
                value={selectedModel}
                onValueChange={setSelectedModel}
                disabled={modelsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn model AI..." />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      <div className="flex items-center gap-2">
                        <span>{model.name || model.id}</span>
                        {(model.isFree || isFreeModel(model.id)) && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0 text-green-600 bg-green-500/10"
                          >
                            Free
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {modelsLoading && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Đang tải
                  models...
                </p>
              )}
            </div>

            {/* Selected summary */}
            <div className="rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">Charts đã chọn: </span>
              <span className="font-semibold">{selectedIds.length}</span>
            </div>

            {/* Analyze button */}
            <Button
              className="w-full"
              onClick={handleAnalyze}
              disabled={
                selectedIds.length === 0 ||
                !selectedModel ||
                analyzeMutation.isPending
              }
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Phân tích với AI
                </>
              )}
            </Button>

            {selectedIds.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">
                ↑ Chọn ít nhất 1 chart để bắt đầu phân tích
              </p>
            )}
          </div>

          {/* Analysis result */}
          {analyzeMutation.data && (
            <AnalysisResult text={analyzeMutation.data.analysis ?? ""} />
          )}

          {analyzeMutation.isError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
              Đã xảy ra lỗi khi phân tích. Vui lòng thử lại.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
