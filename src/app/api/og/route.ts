import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  // Embed the real contest logo so OG previews match the website exactly.
  let logo = "";
  try {
    const svg = await readFile(path.join(process.cwd(), "public", "contest-logo.svg"), "utf8");
    logo = Buffer.from(svg).toString("base64");
  } catch {
    /* fall back to text-only card */
  }

  const logoTag = logo
    ? `<image href="data:image/svg+xml;base64,${logo}" x="600" y="70" width="540" height="505" preserveAspectRatio="xMidYMid meet"/>`
    : `<text x="900" y="300" text-anchor="middle" font-family="Arial" font-weight="800" font-size="72" fill="#16A34A">LOGO</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="2" fill="#0E2F33" opacity=".12"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="#F3FAF1"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <rect x="48" y="48" width="1104" height="534" rx="46" fill="#fff" stroke="#0E2F33" stroke-width="7"/>
  ${logoTag}
  <rect x="96" y="110" width="150" height="52" rx="26" fill="#F9B825" stroke="#0E2F33" stroke-width="5"/>
  <text x="171" y="145" text-anchor="middle" font-family="Arial" font-weight="800" font-size="22" fill="#0E2F33">EST. 1963</text>
  <text x="96" y="250" font-family="Arial" font-weight="800" font-size="74" fill="#0E2F33">Logo Design</text>
  <text x="96" y="335" font-family="Arial" font-weight="800" font-size="74" fill="#2563EB">Contest 2026</text>
  <text x="96" y="415" font-family="sans-serif" font-weight="700" font-size="34" fill="#16A34A">লোগো ডিজাইন প্রতিযোগিতা</text>
  <text x="96" y="470" font-family="sans-serif" font-weight="500" font-size="26" fill="#0E2F33">রাজশাহী সরকারি পলিটেকনিক ইনস্টিটিউট, রাজশাহী</text>
  <rect x="96" y="510" width="380" height="14" rx="7" fill="#F9B825"/>
  <rect x="96" y="534" width="240" height="10" rx="5" fill="#A3CF3A"/>
</svg>`;
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
  });
}
