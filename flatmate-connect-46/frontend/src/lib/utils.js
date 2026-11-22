// Tiny helper used everywhere a component needs to combine Tailwind
// classes conditionally (e.g. `cn("btn", active && "btn-active")`) without
// ending up with duplicate/conflicting classes.
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
