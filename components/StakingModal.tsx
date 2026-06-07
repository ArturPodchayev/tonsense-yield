"use client";

import type { ApyRow, StakingInfo } from "@/lib/apyData";

interface StakingModalProps {
  row: ApyRow & { stakingInfo: StakingInfo };
  onClose: () => void;
}

export function StakingModal({ row, onClose }: StakingModalProps) {
  const { stakingInfo } = row;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,8,16,0.88)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card w-full max-w-md p-6 relative"
        style={{ boxShadow: "0 0 60px rgba(0,152,234,0.14)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          ×
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{row.icon}</span>
          <h2 className="text-lg font-semibold text-text-primary">Stake TON</h2>
        </div>
        <div className="mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "rgba(0,152,234,0.12)",
              border: "1px solid rgba(0,152,234,0.25)",
              color: "#0098EA",
            }}
          >
            via {stakingInfo.protocol}
          </span>
        </div>

        {/* Flow diagram */}
        <div className="space-y-2 mb-5">
          <div
            className="flex items-center gap-3 rounded-[14px] px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-xl">💎</span>
            <div>
              <div className="text-text-secondary text-xs">You stake</div>
              <div className="text-text-primary font-medium">TON (native)</div>
            </div>
          </div>

          <div className="flex justify-center text-text-secondary text-sm">↓</div>

          <div
            className="flex items-center gap-3 rounded-[14px] px-4 py-3"
            style={{
              background: "rgba(0,201,141,0.06)",
              border: "1px solid rgba(0,201,141,0.2)",
            }}
          >
            <span className="text-xl">🪙</span>
            <div className="flex-1">
              <div className="text-text-secondary text-xs">You receive</div>
              <div className="text-text-primary font-medium">{stakingInfo.receivedAsset}</div>
            </div>
            <div
              className="text-sm font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(0,201,141,0.12)",
                border: "1px solid rgba(0,201,141,0.3)",
                color: "#00C98D",
              }}
            >
              {row.bestApy.toFixed(1)}% APY
            </div>
          </div>
        </div>

        {/* Details */}
        <div
          className="rounded-[14px] px-4 py-3 mb-5 space-y-1.5 text-sm"
          style={{
            background: "rgba(0,152,234,0.06)",
            border: "1px solid rgba(0,152,234,0.15)",
          }}
        >
          <div className="flex justify-between">
            <span className="text-text-secondary">Protocol</span>
            <span className="text-accent font-medium">{stakingInfo.protocol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">APY</span>
            <span style={{ color: "#00C98D" }} className="font-semibold">
              {row.bestApy.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Lockup</span>
            <span className="text-text-primary">None — liquid</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Token</span>
            <span className="text-text-primary">{stakingInfo.receivedAsset} (redeemable 1:1)</span>
          </div>
        </div>

        <p className="text-text-secondary text-xs mb-4">{stakingInfo.description}</p>

        <a
          href={stakingInfo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 rounded-[14px] font-semibold text-white text-center transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #0098EA, #007bc4)" }}
        >
          Open {stakingInfo.protocol} ↗
        </a>

        <p className="text-center text-text-secondary text-xs mt-4">
          Omniston handles stablecoin crosschain only — TON native staking is via{" "}
          <span className="text-accent">{stakingInfo.protocol}</span>
        </p>
      </div>
    </div>
  );
}
