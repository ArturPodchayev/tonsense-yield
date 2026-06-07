"use client";

const STATS = [
  { label: "Best TON APY",   value: "5.2%",        color: "#00E090" },
  { label: "Best USDT APY",  value: "4.1% on TON", color: "#00E090" },
  { label: "Best USDC APY",  value: "4.0% on TON", color: "#00E090" },
  { label: "Chains tracked", value: "4",            color: "#F0F4FF" },
  { label: "Swap protocol",  value: "Omniston",     color: "#0098EA" },
];

const CARD_STYLE = {
  background: "rgba(10,10,24,0.85)",
  borderColor: "rgba(0,152,234,0.22)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(0,152,234,0.18) inset",
};

export function StatsBar() {
  return (
    <div className="glass-card overflow-hidden" style={CARD_STYLE}>

      {/* ── Mobile: 2-column grid ────────────────────────────────── */}
      <div
        className="md:hidden grid grid-cols-2"
        style={{ gap: "1px", background: "rgba(0,152,234,0.12)" }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center px-4 py-4 gap-1.5${
              i === STATS.length - 1 && STATS.length % 2 !== 0 ? " col-span-2" : ""
            }`}
            style={{ background: "rgba(10,10,24,0.85)" }}
          >
            <span
              className="text-xs font-medium tracking-wide text-center"
              style={{ color: "#8B9CBF" }}
            >
              {stat.label}
            </span>
            <span className="font-bold text-base" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Desktop: single horizontal row ──────────────────────── */}
      <div className="hidden md:flex items-stretch">
        {STATS.map((stat, i) => (
          <div key={i} className="flex-1 flex items-stretch min-w-0">
            {i > 0 && (
              <div
                className="w-px shrink-0 my-3"
                style={{ background: "rgba(0,152,234,0.18)" }}
              />
            )}
            <div className="flex-1 flex flex-col items-center justify-center px-3 py-4 gap-1">
              <span
                className="text-xs font-medium tracking-wide whitespace-nowrap"
                style={{ color: "#8B9CBF" }}
              >
                {stat.label}
              </span>
              <span
                className="font-bold text-sm whitespace-nowrap"
                style={{ color: stat.color }}
              >
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
