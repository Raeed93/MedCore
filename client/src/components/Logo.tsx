import { useId } from 'react';

/**
 * The Pulse mark: a ring broken at 9 and 3 o'clock so the ECG trace reads
 * through it.
 *
 * This replaces the five near-identical copies that lived in LandingPage,
 * Sidebar, dashboardLayout, loginForm and elsewhere. Each declared its own
 * <mask id="..."> with a hand-picked name — a duplicate-id bug waiting to
 * happen, since SVG mask ids are global to the document and the first match
 * wins. useId() makes the id unique per instance.
 *
 * Colour defaults to the brand token. Pass color="var(--color-bone)" when the
 * mark sits on a filled oxblood surface.
 */
export default function Logo({
  size = 28,
  color = 'var(--color-brand)',
}: {
  size?: number;
  color?: string;
}) {
  const maskId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Pulse"
    >
      <defs>
        <mask id={maskId}>
          <rect width="48" height="48" fill="white" />
          <rect x="3" y="22" width="8" height="4" fill="black" />
          <rect x="37" y="22" width="8" height="4" fill="black" />
        </mask>
      </defs>
      <circle
        cx="24" cy="24" r="18"
        stroke={color} strokeWidth="2.5" fill="none"
        mask={`url(#${maskId})`}
      />
      <path
        d="M2 24 L17 24 L20 17 L24 31 L28 19 L31 24 L46 24"
        stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  );
}
