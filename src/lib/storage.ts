/** Public URL for a stored JPG. Safe to import on the client (only uses public env). */
export function getPublicImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) return path;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  if (url && url.startsWith("http") && !url.includes("your-project")) {
    return `${url.replace(/\/$/, "")}/storage/v1/object/public/logos-jpg/${encodeURI(path)}`;
  }
  return "/contest-logo.svg";
}

export const JPG_BUCKET = "logos-jpg";
export const AI_BUCKET = "logos-ai";
