import { Separator } from "@/shared/components/ui/separator";

export function Footer() {
  return (
    <footer className="w-full">
      <Separator />
      <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} True Look. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
