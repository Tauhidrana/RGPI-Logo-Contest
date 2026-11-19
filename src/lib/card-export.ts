"use client";

type CardData = {
  code: string;
  summary?: {
    full_name: string;
    logo_title: string;
    department_id: string;
    department_name?: string;
    email: string;
    phone: string;
    created_at: string;
  } | null;
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text;
  let out = text;
  while (out.length > 2 && ctx.measureText(out + "…").width > max) out = out.slice(0, -1);
  return out + "…";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draws a shareable confirmation card and downloads it as a PNG. */
export async function downloadSubmissionCard({ code, summary }: CardData) {
  const W = 1200;
  const H = 760;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const canvas = document.createElement("canvas");
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.scale(dpr, dpr);

  const bangla = getComputedStyle(document.body).fontFamily || "sans-serif";
  const ink = "#0E2F33";
  const muted = "#5A7473";
  const brand = "#2563EB";
  const leaf = "#16A34A";

  // canvas background
  ctx.fillStyle = "#F3FAF1";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(14,47,51,.07)";
  for (let x = 20; x < W; x += 26) for (let y = 20; y < H; y += 26) {
    ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
  }

  // main card
  ctx.fillStyle = "#FFFFFF";
  roundRect(ctx, 36, 36, W - 72, H - 72, 36);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = ink;
  ctx.stroke();

  // contest logo
  try {
    const logo = await loadImage("/contest-logo.svg");
    ctx.drawImage(logo, 76, 90, 380, 355);
  } catch {
    ctx.fillStyle = ink;
    ctx.font = `800 54px ${bangla}`;
    ctx.fillText("RGPI", 80, 150);
  }

  // right side badge + title
  ctx.fillStyle = "#F9B825";
  roundRect(ctx, 700, 96, 420, 76, 38);
  ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = ink; ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = `800 34px ${bangla}`;
  ctx.textAlign = "center";
  ctx.fillText("SUBMISSION CONFIRMED", 910, 145);

  ctx.textAlign = "left";
  ctx.fillStyle = leaf;
  ctx.font = `700 42px ${bangla}`;
  ctx.fillText("সাবমিশন সফল!", 700, 235);
  ctx.fillStyle = ink;
  ctx.font = `800 26px ${bangla}`;
  ctx.fillText("আপনার সাবমিশন আইডি", 700, 290);

  ctx.fillStyle = "#F9B825";
  roundRect(ctx, 690, 310, 440, 96, 20);
  ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = ink; ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = `800 46px monospace`;
  ctx.textAlign = "center";
  ctx.fillText(code, 910, 373);
  ctx.textAlign = "left";

  // divider
  ctx.strokeStyle = "rgba(14,47,51,.18)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(80, 500); ctx.lineTo(W - 80, 500); ctx.stroke();
  ctx.setLineDash([]);

  // details
  const rows: [string, string][] = [
    ["নাম", summary?.full_name ?? "—"],
    ["লোগো", summary?.logo_title ?? "—"],
    ["বিভাগ", summary?.department_name ?? summary?.department_id ?? "—"],
    ["ইমেইল", summary?.email ?? "—"],
    ["ফোন", summary?.phone ?? "—"],
    ["জমার সময়", summary?.created_at ? new Date(summary.created_at).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }) : "—"],
  ];
  rows.forEach(([label, value], i) => {
    const y = 548 + i * 30;
    ctx.fillStyle = muted;
    ctx.font = `600 19px ${bangla}`;
    ctx.fillText(label, 84, y);
    ctx.fillStyle = ink;
    ctx.font = `700 19px ${bangla}`;
    ctx.fillText(fit(ctx, value, 480), 240, y);
  });

  // footer
  ctx.fillStyle = "#EEF6F5";
  roundRect(ctx, 690, 540, 440, 150, 22);
  ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(14,47,51,.25)"; ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = `800 22px ${bangla}`;
  ctx.fillText("রাজশাহী সরকারি পলিটেকনিক", 716, 588);
  ctx.fillText("ইনস্টিটিউট, রাজশাহী", 716, 620);
  ctx.fillStyle = brand;
  ctx.font = `800 18px ${bangla}`;
  ctx.fillText("লোগো ডিজাইন প্রতিযোগিতা ২০২৬", 716, 660);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("PNG তৈরি করা যায়নি");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${code}-card.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
