"use client";

const STATS = [
  { label: "Best TON APY", value: "5.2%", color: "#00E090" },
  { label: "Best USDT APY", value: "4.1% on TON", color: "#0098EA" },
  { label: "Best USDC APY", value: "4.0% on TON", color: "#0098EA" },
  { label: "Chains tracked", value: "4", color: "#8B9CBF" },
  { label: "Swap protocol", value: "Omniston", color: "#8B9CBF" },
];

export function StatsBar() {
  return (
    <div
      className="glass-card px-6 py-4 flex flex-wrap gap-x-8 gap-y-3 items-center"
      style={{
        background: "rgba(13,13,26,0.8)",
        borderTop: "1px solid rgba(0,152,234,0.35)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 -1px 0 rgba(0,152,234,0.2) inset",
      }}
    >
      {STATS.map((stat, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: stat.color, opacity: 0.7 }}
          />
          <span className="text-text-secondary text-sm">{stat.label}</span>
          <span className="font-semibold text-sm" style={{ color: stat.color }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
