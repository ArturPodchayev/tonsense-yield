"use client";

import { useState } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import type { ApyRow } from "@/lib/apyData";

interface SwapModalProps {
  row: ApyRow;
  onClose: () => void;
}

export function SwapModal({ row, onClose }: SwapModalProps) {
  const [amount, setAmount] = useState("100");
  const [status, setStatus] = useState<"idle" | "quoting" | "confirming" | "done">("idle");
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();

  const isConnected = Boolean(address);

  const estimatedYield =
    amount && !isNaN(Number(amount))
      ? ((Number(amount) * row.bestApy) / 100).toFixed(2)
      : "0.00";

  async function handleSwap() {
    if (!isConnected) {
      tonConnectUI.openModal();
      return;
    }
    setStatus("quoting");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("confirming");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,8,16,0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card w-full max-w-md p-6 relative"
        style={{ boxShadow: "0 0 60px rgba(0,152,234,0.12)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold text-text-primary mb-1">
          Swap to Best Yield
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Move{" "}
          <span className="text-accent font-medium">
            {row.symbol}
          </span>{" "}
          to earn{" "}
          <span className="text-green-yield font-medium">
            {row.bestApy}% APY
          </span>{" "}
          on {row.bestChain}
        </p>

        {/* From */}
        <div className="mb-3">
          <label className="text-xs text-text-secondary mb-1.5 block">
            From
          </label>
          <div
            className="flex items-center gap-3 rounded-[14px] px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-xl">{row.icon}</span>
            <div className="flex-1">
              <div className="text-text-secondary text-xs">Your wallet</div>
              <div className="text-text-primary font-medium">{row.symbol}</div>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent text-right text-text-primary font-medium w-24 outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center my-2 text-text-secondary">↓</div>

        {/* To */}
        <div className="mb-6">
          <label className="text-xs text-text-secondary mb-1.5 block">
            To (Best yield destination)
          </label>
          <div
            className="flex items-center gap-3 rounded-[14px] px-4 py-3"
            style={{
              background: "rgba(0,201,141,0.06)",
              border: "1px solid rgba(0,201,141,0.2)",
            }}
          >
            <span className="text-xl">💎</span>
            <div className="flex-1">
              <div className="text-text-secondary text-xs">{row.bestChain} · Tonstakers</div>
              <div className="text-text-primary font-medium">{row.symbol}</div>
            </div>
            <div className="text-right">
              <div className="text-green-yield font-semibold">{row.bestApy}%</div>
              <div className="text-text-secondary text-xs">APY</div>
            </div>
          </div>
        </div>

        {/* Yield estimate */}
        {amount && Number(amount) > 0 && (
          <div
            className="rounded-[14px] px-4 py-3 mb-5 flex justify-between items-center"
            style={{
              background: "rgba(0,152,234,0.06)",
              border: "1px solid rgba(0,152,234,0.15)",
            }}
          >
            <span className="text-text-secondary text-sm">Estimated yearly yield</span>
            <span className="text-accent font-semibold">
              +{estimatedYield} {row.symbol}
            </span>
          </div>
        )}

        {/* Status / CTA */}
        {status === "idle" && (
          <button
            onClick={handleSwap}
            className="w-full py-3.5 rounded-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #0098EA, #007bc4)" }}
          >
            {isConnected ? "Get Quote via Omniston" : "Connect Wallet to Swap"}
          </button>
        )}

        {status === "quoting" && (
          <div className="w-full py-3.5 rounded-[14px] font-semibold text-center text-text-secondary"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            Fetching Omniston quote…
          </div>
        )}

        {status === "confirming" && (
          <div className="space-y-3">
            <div
              className="rounded-[14px] px-4 py-3 text-sm"
              style={{ background: "rgba(0,152,234,0.08)", border: "1px solid rgba(0,152,234,0.2)" }}
            >
              <div className="flex justify-between mb-1">
                <span className="text-text-secondary">Quote</span>
                <span className="text-text-primary">{amount} {row.symbol} → {amount} {row.symbol}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-text-secondary">Route</span>
                <span className="text-accent">Omniston RFQ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Slippage</span>
                <span className="text-text-primary">0.5%</span>
              </div>
            </div>
            <button
              onClick={() => setStatus("done")}
              className="w-full py-3.5 rounded-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #00C98D, #00a873)" }}
            >
              Confirm Swap
            </button>
          </div>
        )}

        {status === "done" && (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-text-primary font-semibold mb-1">Swap submitted!</p>
            <p className="text-text-secondary text-sm">
              Your {row.symbol} is now earning {row.bestApy}% APY on {row.bestChain}
            </p>
          </div>
        )}

        <p className="text-center text-text-secondary text-xs mt-4">
          Powered by{" "}
          <span className="text-accent">Omniston</span> crosschain SDK
        </p>
      </div>
    </div>
  );
}
