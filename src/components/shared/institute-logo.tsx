import { cn } from "@/lib/utils";
import { ContestLogo } from "./contest-logo";

/** Kept as an alias so all existing usages show the official contest identity. */
export function InstituteLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("inline-flex shrink-0 items-center", className)}>
      <ContestLogo
        variant="compact"
        className={compact ? "h-10 w-auto" : "h-12 w-auto"}
      />
    </div>
  );
}
