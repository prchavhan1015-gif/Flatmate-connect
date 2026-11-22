// Shows the user's profile picture, falling back to their initials while
// the image loads (or when no photo has been uploaded).
import { useEffect, useState } from "react";

import { getAvatarUrl, initialsOf } from "@/lib/profile";
import { cn } from "@/lib/utils";

export function ProfileAvatar({ path, name, className }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let active = true;
    setUrl(null);
    getAvatarUrl(path).then((signed) => {
      if (active) setUrl(signed);
    });
    return () => {
      active = false;
    };
  }, [path]);

  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-brand text-sm font-bold text-primary-foreground",
        className,
      )}
    >
      {url ? (
        <img src={url} alt={name} className="size-full object-cover" loading="lazy" />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}
