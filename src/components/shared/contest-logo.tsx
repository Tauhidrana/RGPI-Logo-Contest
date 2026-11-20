import { cn } from "@/lib/utils";

/**
 * RGPI Logo Design Contest 2026 — official contest identity.
 * Recreated as crisp SVG so it scales everywhere (header, hero, OG, panels).
 */
export function ContestLogo({
  className,
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "compact";
}) {
  const teeth = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const r1 = i % 2 === 0 ? 58 : 47;
    // Round coordinates so server and browser produce byte-identical markup.
    return `${(90 + Math.cos(a) * r1).toFixed(2)},${(92 + Math.sin(a) * r1).toFixed(2)}`;
  }).join(" ");

  return (
    <svg
      viewBox={variant === "compact" ? "80 180 875 600" : "0 0 1000 935"}
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="RGPI Logo Design Contest 2026 — লোগো ডিজাইন প্রতিযোগিতা"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>{`
          .dsp { font-family: 'Baloo 2', 'Inter', Arial, sans-serif; font-weight: 800; }
          .bn  { font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif; font-weight: 700; }
        `}</style>
      </defs>

      {variant === "full" && (
        <>
          {/* Seal */}
          <polygon points={teeth} fill="#D92D2D" />
          <circle cx="90" cy="92" r="42" fill="#fff" />
          <circle cx="90" cy="92" r="35" fill="#D92D2D" />
          <text x="90" y="80" textAnchor="middle" className="bn" fontSize="12" fill="#fff">রাজশাহী</text>
          <text x="90" y="96" textAnchor="middle" className="bn" fontSize="12" fill="#fff">সরকারি</text>
          <text x="90" y="112" textAnchor="middle" className="bn" fontSize="11" fill="#fff">পলিটেকনিক</text>

          {/* Institute name */}
          <text x="185" y="92" className="dsp" fontSize="41" letterSpacing="1" fill="#0E2F33">RAJSHAHI GOVT.</text>
          <text x="185" y="140" className="dsp" fontSize="41" letterSpacing="1" fill="#0E2F33">POLYTECHNIC INSTITUTE</text>

          {/* Est. pill */}
          <rect x="765" y="62" width="200" height="72" rx="36" fill="#F9B825" stroke="#0E2F33" strokeWidth="6" />
          <text x="865" y="112" textAnchor="middle" className="dsp" fontSize="35" fill="#0E2F33">EST. 1963</text>
        </>
      )}

      {/* L */}
      <g transform="rotate(-4 275 300)">
        <rect x="196" y="222" width="192" height="182" rx="34" fill="#F9B825" />
        <rect x="180" y="210" width="192" height="182" rx="34" fill="#16A34A" stroke="#0E2F33" strokeWidth="7" />
        <text x="276" y="352" textAnchor="middle" className="dsp" fontSize="150" fill="#fff">L</text>
      </g>
      {/* O */}
      <g>
        <rect x="410" y="222" width="180" height="180" rx="34" fill="#F9B825" />
        <circle cx="495" cy="305" r="96" fill="#F9B825" stroke="#0E2F33" strokeWidth="7" />
        <circle cx="495" cy="305" r="49" fill="#0E2F33" />
        <circle cx="495" cy="305" r="23" fill="#F9B825" />
      </g>
      {/* G */}
      <g transform="rotate(4 700 300)">
        <rect x="622" y="222" width="188" height="182" rx="34" fill="#2563EB" />
        <rect x="606" y="210" width="188" height="182" rx="34" fill="#2563EB" stroke="#0E2F33" strokeWidth="7" />
        <text x="700" y="352" textAnchor="middle" className="dsp" fontSize="146" fill="#fff">G</text>
      </g>
      {/* O (lime) */}
      <g>
        <rect x="830" y="222" width="178" height="180" rx="34" fill="#A3CF3A" />
        <circle cx="918" cy="305" r="96" fill="#A3CF3A" stroke="#0E2F33" strokeWidth="7" />
        <circle cx="918" cy="305" r="49" fill="#0E2F33" />
        <circle cx="918" cy="305" r="23" fill="#A3CF3A" />
      </g>

      {/* DESIGN bar */}
      <rect x="100" y="434" width="800" height="180" rx="52" fill="#0E2F33" />
      {Array.from({ length: 23 }, (_, i) => (
        <rect key={i} x={132 + i * 34} y="450" width="5" height="22" rx="2" fill="#3C6A67" />
      ))}
      <text x="500" y="560" textAnchor="middle" className="dsp" fontSize="112" letterSpacing="9" fill="#F9B825">DESIGN</text>

      {/* CONTEST */}
      <text x="100" y="738" className="dsp" fontSize="118" letterSpacing="3" fill="#2563EB">CONTEST</text>

      {/* 2026 badge */}
      <g>
        <circle cx="884" cy="704" r="86" fill="#0E2F33" />
        <circle cx="870" cy="690" r="86" fill="#F9B825" stroke="#0E2F33" strokeWidth="7" />
        <text x="870" y="710" textAnchor="middle" className="dsp" fontSize="46" fill="#0E2F33">2026</text>
        <path d="M928 748 L982 762 L946 800 Z" fill="#0E2F33" />
      </g>

      {variant === "full" && (
        <>
          {/* Bangla title */}
          <text x="500" y="838" textAnchor="middle" className="bn" fontSize="58" fill="#16A34A">লোগো ডিজাইন প্রতিযোগিতা</text>

          {/* Theme pills */}
          {[
            { x: 120, w: 190, t: "Departments", f: "#fff" },
            { x: 330, w: 190, t: "Engineering", f: "#fff" },
            { x: 540, w: 190, t: "Education", f: "#fff" },
            { x: 750, w: 220, t: "Green Campus", f: "#A3CF3A" },
          ].map((p) => (
            <g key={p.t}>
              <rect x={p.x} y="862" width={p.w} height="62" rx="31" fill={p.f} stroke="#0E2F33" strokeWidth="5" />
              <text x={p.x + p.w / 2} y="903" textAnchor="middle" className="dsp" fontSize="26" fill="#0E2F33">{p.t}</text>
            </g>
          ))}
        </>
      )}
    </svg>
  );
}
