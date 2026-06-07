"use client";

const STATS = [
  { label: "Best TON APY",  value: "5.2%",       color: "#00E090" },
  { label: "Best USDT APY", value: "4.1% on TON", color: "#00E090" },
  { label: "Best USDC APY", value: "4.0% on TON", color: "#00E090" },
  { label: "Chains tracked", value: "4",          color: "#F0F4FF" },
  { label: "Swap protocol",  value: "Omniston",   color: "#0098EA" },
];

export function StatsBar() {
  return (
    <div
      className="glass-card flex items-stretch overflow-hidden"
      style={{
        background: "rgba(10,10,24,0.85)",
        borderColor: "rgba(0,152,234,0.22)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45), 0 1px 0 rgba(0,152,234,0.18) inset",
      }}
    >
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
  );
}
