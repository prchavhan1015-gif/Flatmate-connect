// A small spinner (Loader) and a full-page centered version of it
// (PageLoader), shown while auth/session state is still being read.
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Loader({ label, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16", className)}>
      <Loader2 className="size-7 animate-spin text-primary" />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader label="Loading…" />
    </div>
  );
}
