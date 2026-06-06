"use client";

const STATS = [
  { label: "Best TON APY", value: "5.2%", color: "#00C98D" },
  { label: "Best USDT APY", value: "4.1% on TON", color: "#0098EA" },
  { label: "Best USDC APY", value: "4.0% on TON", color: "#0098EA" },
  { label: "Chains tracked", value: "4", color: "#8B9CBF" },
  { label: "Swap protocol", value: "Omniston", color: "#8B9CBF" },
];

export function StatsBar() {
  return (
    <div className="glass-card px-6 py-4 flex flex-wrap gap-6 items-center">
      {STATS.map((stat, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-text-secondary text-sm">{stat.label}</span>
          <span className="font-semibold text-sm" style={{ color: stat.color }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
