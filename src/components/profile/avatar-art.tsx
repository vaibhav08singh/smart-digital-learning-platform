// ============================================================
// AvatarArt — renders a cartoon student as pure SVG.
// Used by <UserAvatar /> so the same character shows anywhere.
// ============================================================

import type { AvatarOption } from "@/data/avatars";

interface AvatarArtProps {
  option: AvatarOption;
  /** Render size in px (the SVG scales to 100% of container). */
  className?: string;
}

export function AvatarArt({ option, className }: AvatarArtProps) {
  const { skin, hair, hairStyle, accessory, accent } = option;

  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Cartoon student avatar"
      className={className}
    >
      {/* Background */}
      <defs>
        <linearGradient id={`bg-${option.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={skin} stopOpacity="0.22" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.14" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill={`url(#bg-${option.id})`} />

      {/* Shoulders / shirt */}
      <path
        d="M16 96c0-14 10-22 22-24l4 12c-6 4-10 8-12 12H16z"
        fill={accent}
        opacity="0.9"
      />
      <path
        d="M80 96c0-14-10-22-22-24l-4 12c6 4 10 8 12 12h14z"
        fill={accent}
        opacity="0.9"
      />

      {/* Neck */}
      <rect x="42" y="58" width="12" height="12" rx="4" fill={shade(skin, -14)} />

      {/* Ears */}
      <circle cx="24" cy="48" r="5" fill={skin} />
      <circle cx="72" cy="48" r="5" fill={skin} />

      {/* Head */}
      <circle cx="48" cy="44" r="26" fill={skin} />

      {/* Hair (behind face for some styles) */}
      {hairStyle !== "none" && (
        <g>
          {hairStyle === "short" && (
            <path d="M22 40c0-16 12-24 26-24s26 8 26 24c-4-10-12-14-26-14S26 30 22 40z" fill={hair} />
          )}
          {hairStyle === "spiky" && (
            <path
              d="M24 44l-3-10 7 4 3-9 6 6 4-10 4 10 5-6 3 9 6-4-2 10c-4 8-12 12-16 12s-13-4-17-12z"
              fill={hair}
            />
          )}
          {hairStyle === "curly" && (
            <g fill={hair}>
              <circle cx="28" cy="34" r="9" />
              <circle cx="40" cy="26" r="9" />
              <circle cx="56" cy="26" r="9" />
              <circle cx="68" cy="34" r="9" />
              <circle cx="48" cy="22" r="8" />
              <path d="M24 38c4-10 40-12 48 0-6 8-16 10-24 10s-18-2-24-10z" />
            </g>
          )}
          {hairStyle === "bun" && (
            <g fill={hair}>
              <path d="M24 40c0-15 12-24 24-24s24 9 24 24c0-9-10-14-24-14s-24 5-24 14z" />
              <circle cx="48" cy="18" r="8" />
            </g>
          )}
          {hairStyle === "fringe" && (
            <path d="M23 40c0-14 11-24 25-24s25 10 25 24c-4-8-12-12-25-12S27 32 23 40z" fill={hair} />
          )}
        </g>
      )}

      {/* Face: eyes */}
      <g fill="#263238">
        <circle cx="38" cy="44" r="3" />
        <circle cx="58" cy="44" r="3" />
        <circle cx="39.4" cy="42.8" r="1.1" fill="#fff" />
        <circle cx="59.4" cy="42.8" r="1.1" fill="#fff" />
      </g>

      {/* Eyebrows */}
      <g stroke={hair} strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M33 38.5c2-1.5 5-2 7-1.5" />
        <path d="M63 38.5c-2-1.5-5-2-7-1.5" />
      </g>

      {/* Nose */}
      <path d="M48 46c1.5 2 1.5 4 0 6" stroke={shade(skin, -26)} strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* Smile */}
      <path d="M41 53c3.5 4 10.5 4 14 0" stroke={shade(skin, -40)} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Cheeks */}
      <circle cx="33" cy="52" r="3" fill="#f87171" opacity="0.35" />
      <circle cx="63" cy="52" r="3" fill="#f87171" opacity="0.35" />

      {/* Accessory */}
      {accessory === "glasses" && (
        <g stroke="#1f2937" strokeWidth="2" fill="none">
          <circle cx="38" cy="44" r="6" />
          <circle cx="58" cy="44" r="6" />
          <path d="M44 44h8" />
          <path d="M32 43l-3-2M64 43l3-2" />
        </g>
      )}
      {accessory === "headphones" && (
        <g stroke="#374151" strokeWidth="3" fill="none">
          <path d="M22 48a26 26 0 0 1 52 0" />
          <rect x="18" y="46" width="9" height="12" rx="4" fill="#374151" stroke="none" />
          <rect x="69" y="46" width="9" height="12" rx="4" fill="#374151" stroke="none" />
        </g>
      )}
      {accessory === "cap" && (
        <g>
          <path d="M24 40c2-10 12-16 24-16s22 6 24 16l-6 3c-2-6-9-10-18-10s-16 4-18 10z" fill={accent} />
          <path d="M70 40l3 7a4 4 0 1 1-3-7z" fill={accent} />
        </g>
      )}

      {/* Hair front fringe for short style */}
      {hairStyle === "short" && (
        <path d="M30 34c2-3 4-4 7-4" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
      {hairStyle === "fringe" && (
        <path d="M30 32c3-3 7-4 11-3" stroke={hair} strokeWidth="3" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

/** Darken a hex color by `amount` (negative = lighten). */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
