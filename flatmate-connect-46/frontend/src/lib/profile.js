// Small helpers for working with a saved profile: how "complete" it is,
// looking up the avatar image, and turning a name into initials for the
// fallback avatar.
import { db } from "@/lib/db";

/** Fields that count towards the "profile completion" percentage. */
const COMPLETION_FIELDS = [
  "full_name",
  "avatar_url",
  "age",
  "gender",
  "occupation",
  "organization",
  "phone",
  "city",
  "budget",
  "move_in_date",
  "bio",
  "food_preference",
  "smoking",
  "drinking",
  "pets",
  "sleep_schedule",
  "cleanliness",
];

export function completionPercentage(profile) {
  if (!profile) return 0;
  let filled = 0;
  for (const field of COMPLETION_FIELDS) {
    const value = profile[field];
    if (value !== null && value !== undefined && value !== "") filled += 1;
  }
  if (profile.interests.length > 0) filled += 1;
  return Math.round((filled / (COMPLETION_FIELDS.length + 1)) * 100);
}

/**
 * Avatars are stored as data URLs in localStorage, keyed by path — this
 * just looks the image up.
 */
export async function getAvatarUrl(path) {
  if (!path) return null;
  const { data } = await db.storage.from("avatars").createSignedUrl(path, 60 * 60);
  return data?.signedUrl ?? null;
}

export function initialsOf(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "RM"
  );
}
