import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const W = 800;
const H = 500;

function project(lon: number, lat: number): [number, number] {
  const toRad = Math.PI / 180;
  const x = (lon - 18) * toRad * 700 + W / 2;
  const mercY = Math.log(Math.tan(Math.PI / 4 + (lat * toRad) / 2));
  const mercCenter = Math.log(Math.tan(Math.PI / 4 + (40 * toRad) / 2));
  const y = -(mercY - mercCenter) * 700 + H / 2;
  return [x, y];
}

const CITIES = [
  {
    name: "Beirut",
    lon: 35.5018,
    lat: 33.8938,
    labelOffset: [0, 20] as [number, number],
    labelAnchor: "middle" as const,
    chapter: "The Beginning",
    story:
      "Born and raised in Lebanon, surrounded by bold Mediterranean flavours and a culture that lives fully. It's where my relationship with real, vibrant food began — and where the seeds of Kick were planted long before I knew it.",
    image: "/images/beirut.jpg",
    placeholderGradient: "linear-gradient(135deg, #c8864a 0%, #a0522d 100%)",
    placeholderLabel: "📍 Beirut, Lebanon",
  },
  {
    name: "Paris",
    lon: 2.3522,
    lat: 48.8566,
    labelOffset: [0, -13] as [number, number],
    labelAnchor: "middle" as const,
    chapter: "The Discovery",
    story:
      "Ten years of studies, work, and too many aperitivos. It was here I first discovered functional ginger shots — a couple of sips and you feel completely reborn. I was hooked from day one.",
    // 👉 Replace null with your photo path, e.g. image: "/images/paris.jpg"
    image: null as string | null,
    placeholderGradient: "linear-gradient(135deg, #8b7fa8 0%, #5c5470 100%)",
    placeholderLabel: "📍 Paris, France",
  },
  {
    name: "Milan",
    lon: 9.19,
    lat: 45.4654,
    labelOffset: [14, 4] as [number, number],
    labelAnchor: "start" as const,
    chapter: "The Birth of Kick",
    story:
      "Relocated and couldn't find the shots I loved anywhere. So I made them myself — using the exceptional organic ingredients Italy has to offer. Starting with just three: ginger, green apple, and lemon. That's how Kick was born.",
    // 👉 Replace null with your photo path, e.g. image: "/images/milan.jpg"
    image: null as string | null,
    placeholderGradient: "linear-gradient(135deg, #d4882a 0%, #a85c10 100%)",
    placeholderLabel: "📍 Milan, Italy",
  },
];

const positions = CITIES.map((c) => project(c.lon, c.lat));
const pathD = `M ${positions[0][0].toFixed(1)},${positions[0][1].toFixed(1)} L ${positions[1][0].toFixed(1)},${positions[1][1].toFixed(1)} L ${positions[2][0].toFixed(1)},${positions[2][1].toFixed(1)}`;

const seg1 = Math.hypot(positions[1][0] - positions[0][0], positions[1][1] - positions[0][1]);
const seg2 = Math.hypot(positions[2][0] - positions[1][0], positions[2][1] - positions[1][1]);
const total = seg1 + seg2;
const parisRatio = seg1 / total;

const ANIM_DURATION = 2.5;
const ANIM_DELAY = 0.6;

const cityDelay = (i: number) => {
  if (i === 0) return ANIM_DELAY;
  if (i === 1) return ANIM_DELAY + ANIM_DURATION * parisRatio;
  return ANIM_DELAY + ANIM_DURATION;
};

const StoryJourneyMap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const active = selected ?? hovered;

  const handleSelect = (i: number) => setSelected(selected === i ? null : i);

  return (
    <section ref={ref} className="bg-secondary py-20">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-white/60 mb-3 block">
            The Journey
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: "Garet, sans-serif" }}
          >
            From Beirut to Milan
          </h2>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mx-auto rounded-2xl overflow-hidden"
          style={{ maxWidth: 800, background: "rgba(0,0,0,0.15)" }}
        >
          <ComposableMap
            width={W}
            height={H}
            projection="geoMercator"
            projectionConfig={{ center: [18, 40], scale: 700 }}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: "rgba(255,255,255,0.12)", stroke: "rgba(255,255,255,0.2)", strokeWidth: 0.5, outline: "none" },
                      hover: { fill: "rgba(255,255,255,0.12)", outline: "none" },
                      pressed: { fill: "rgba(255,255,255,0.12)", outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Route line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : {}}
              transition={{ duration: ANIM_DURATION, ease: "easeInOut", delay: ANIM_DELAY }}
            />

            {/* City markers */}
            {CITIES.map((city, i) => {
              const [cx, cy] = positions[i];
              const [lx, ly] = city.labelOffset;
              const delay = cityDelay(i);
              const isActive = active === i;
              const isDimmed = active !== null && !isActive;

              return (
                <g
                  key={city.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle cx={cx} cy={cy} r={22} fill="transparent" />

                  {/* Pulse ring */}
                  <motion.circle
                    cx={cx} cy={cy} r={12}
                    fill="none" stroke="white" strokeWidth={1}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: [0, isActive ? 0.8 : 0.4, 0], scale: [0.5, 2.2, 3] } : {}}
                    transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 1.8 }}
                  />

                  {/* Dot */}
                  <motion.circle
                    cx={cx} cy={cy} r={isActive ? 8 : 5}
                    fill={isActive ? "#FACC15" : "white"}
                    opacity={isDimmed ? 0.3 : 1}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: isDimmed ? 0.3 : 1, scale: 1 } : {}}
                    transition={{ duration: 0.25, delay: selected !== null ? 0 : delay, type: "spring", stiffness: 250 }}
                  />

                  {/* Label */}
                  <motion.text
                    x={cx + lx} y={cy + ly}
                    textAnchor={city.labelAnchor}
                    fill={isActive ? "#FACC15" : "white"}
                    fillOpacity={isDimmed ? 0.3 : 0.9}
                    fontSize={10} fontWeight={700} letterSpacing={1.5}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: isDimmed ? 0.3 : 0.9 } : {}}
                    transition={{ duration: 0.3, delay: selected !== null ? 0 : delay + 0.2 }}
                    style={{ fontFamily: "Garet, sans-serif", textTransform: "uppercase", pointerEvents: "none" }}
                  >
                    {city.name}
                  </motion.text>

                  {/* Hover tooltip */}
                  <AnimatePresence>
                    {hovered === i && selected !== i && (
                      <motion.g
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <rect x={cx - 52} y={cy - 44} width={104} height={28} rx={4} fill="rgba(0,0,0,0.65)" />
                        <text x={cx} y={cy - 26} textAnchor="middle" fill="white" fontSize={9} fontWeight={600} letterSpacing={1}
                          style={{ fontFamily: "Garet, sans-serif", textTransform: "uppercase" }}>
                          {city.chapter}
                        </text>
                        <text x={cx} y={cy - 35} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={8}
                          style={{ fontFamily: "sans-serif" }}>
                          click to explore
                        </text>
                      </motion.g>
                    )}
                  </AnimatePresence>
                </g>
              );
            })}
          </ComposableMap>
        </motion.div>

        {/* City cards (always visible, dim when one is selected) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-4xl mx-auto">
          {CITIES.map((city, i) => {
            const isActive = selected === i;
            const isDimmed = selected !== null && !isActive;
            return (
              <motion.button
                key={city.name}
                onClick={() => handleSelect(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                animate={{ opacity: isDimmed ? 0.4 : 1, scale: isActive ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
                className="text-left rounded-xl px-5 py-4 w-full"
                style={{
                  background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  border: isActive ? "1px solid rgba(250,204,21,0.7)" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] mb-1"
                  style={{ color: isActive ? "#FACC15" : "rgba(255,255,255,0.5)" }}>
                  {city.chapter}
                </p>
                <p className="text-white text-base font-bold" style={{ fontFamily: "Garet, sans-serif" }}>
                  {city.name}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {isActive ? "click to close" : "click to explore →"}
                </p>
              </motion.button>
            );
          })}
        </div>

        {/* Full-width story + photo panel */}
        <AnimatePresence mode="wait">
          {selected !== null && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-6 max-w-4xl mx-auto rounded-2xl overflow-hidden"
              style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="grid md:grid-cols-2 min-h-[320px]">

                {/* Photo side */}
                <div className="relative md:min-h-[320px] overflow-hidden">
                  {CITIES[selected].image ? (
                    <img
                      src={CITIES[selected].image!}
                      alt={CITIES[selected].name}
                      className="w-full h-[240px] md:h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex flex-col items-center justify-center gap-3"
                      style={{ background: CITIES[selected].placeholderGradient }}
                    >
                      <span className="text-3xl">🖼️</span>
                      <p className="text-white/70 text-sm font-medium">{CITIES[selected].placeholderLabel}</p>
                      <p className="text-white/40 text-xs">Your photo goes here</p>
                    </div>
                  )}
                </div>

                {/* Story side */}
                <div className="p-8 flex flex-col justify-center relative">
                  <button
                    onClick={() => setSelected(null)}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-400 mb-2">
                    {CITIES[selected].chapter}
                  </p>
                  <h3
                    className="text-white text-3xl font-bold mb-4"
                    style={{ fontFamily: "Garet, sans-serif" }}
                  >
                    {CITIES[selected].name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {CITIES[selected].story}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default StoryJourneyMap;
