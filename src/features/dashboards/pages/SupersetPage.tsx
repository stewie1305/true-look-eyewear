import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import ManageChartsPage from "@/features/charts/pages/ManageChartsPage";

const SUPERSET_BASE_URL = "https://superset.tanhuynh.xyz";

export default function SupersetPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#ai-chart-analyst") {
      const el = document.getElementById("ai-chart-analyst");
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }
  }, [location.hash]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Superset Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">Dashboard analytics</p>
        </div>

        <Button asChild variant="outline">
          <a href={SUPERSET_BASE_URL} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Mở ở tab mới
          </a>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <iframe
          title="Superset Dashboard"
          src={SUPERSET_BASE_URL}
          className="h-[calc(100vh-14rem)] min-h-180 w-full"
          style={{ border: "none" }}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      <div id="ai-chart-analyst" className="pt-2">
        <ManageChartsPage />
      </div>
    </section>
  );
}
