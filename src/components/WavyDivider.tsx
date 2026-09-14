interface WavyDividerProps {
  className?: string;
  flip?: boolean;
  /** "fill" (default) makes a filled wave transitioning between two different
   * section colors. "line" draws just a thin stroked wavy line — use this
   * when both sides are the same color and you just want a decorative
   * squiggle, not a solid color block. */
  variant?: "fill" | "line";
}

// A section-transition wave. Pass a `bg-*` matching the section above (so the
// divider's own background has no seam) and a `text-*` matching the section
// below (the wave shape fills with currentColor, previewing what's next).
// `flip` mirrors it vertically for the reverse transition.
const WavyDivider = ({ className = "", flip = false, variant = "fill" }: WavyDividerProps) => (
  <div className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""} ${className}`}>
    {variant === "line" ? (
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-12 md:h-20 block overflow-visible">
        <path
          d="M0,40 C200,90 400,-10 600,40 C800,90 1000,-10 1200,40"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-12 md:h-20 block">
        <path d="M0,40 C200,90 400,-10 600,40 C800,90 1000,-10 1200,40 L1200,80 L0,80 Z" fill="currentColor" />
      </svg>
    )}
  </div>
);

export default WavyDivider;
