// Sets the browser tab title for whichever page calls this. Each page
// calls usePageTitle("...") once near the top of its component.
import { useEffect } from "react";

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
