"use client";

/**
 * Re-encodes a JPG in the browser to keep uploads small (helps the 1 GB storage quota).
 * Keeps the original when compression would make it larger or fails.
 */
export async function compressJpg(file: File, maxEdge = 1600, quality = 0.86): Promise<File> {
  if (file.type !== "image/jpeg" && file.type !== "image/jpg") return file;

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Image decode failed"));
      el.src = url;
    });

    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, w, h);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}
