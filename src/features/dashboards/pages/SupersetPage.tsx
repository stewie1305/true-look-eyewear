import { ExternalLink } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

const SUPERSET_BASE_URL = "https://superset.tanhuynh.xyz";

export default function SupersetPage() {
  return (
    <section className="space-y-4">
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
    </section>
  );
}
