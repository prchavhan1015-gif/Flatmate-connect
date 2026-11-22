// A row of pill-shaped toggle buttons for picking interests (used on the
// onboarding form and to display a profile's interests read-only).
import { cn } from "@/lib/utils";

export function InterestChips({ options, selected, onToggle, className }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            disabled={!onToggle}
            onClick={() => onToggle?.(option)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
              onToggle && "cursor-pointer hover:-translate-y-0.5",
              active
                ? "border-transparent bg-gradient-brand text-primary-foreground shadow-soft"
                : "border-border bg-secondary text-secondary-foreground",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
