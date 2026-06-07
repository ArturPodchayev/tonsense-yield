"use client";

import { useState } from "react";
import { APY_DATA, CHAIN_LABELS, type ApyRow, type ChainKey, type SwapConfig, type StakingInfo } from "@/lib/apyData";
import { SwapModal } from "./SwapModal";
import { StakingModal } from "./StakingModal";

const CHAINS: ChainKey[] = ["tonApy", "ethApy", "baseApy", "bnbApy"];

function yearlyEst(amountStr: string, apy: number): string {
  const n = parseFloat(amountStr || "0");
  if (!(n > 0)) return "";
  const earned = (n * apy) / 100;
  if (earned < 0.01) return "";
  if (earned < 1) return `+$${earned.toFixed(2)}/yr`;
  if (earned < 1000) return `+$${Math.round(earned)}/yr`;
  return `+$${(earned / 1000).toFixed(1)}k/yr`;
}

function ApyCell({ value, isBest }: { value: number | null; isBest: boolean }) {
  if (value === null) {
    return <span className="text-text-secondary">—</span>;
  }
  return (
    <span
      className={`font-semibold tabular-nums ${
        isBest ? "text-green-yield" : "text-text-primary"
      }`}
    >
      {value.toFixed(1)}%
    </span>
  );
}

function BestBadge({ chain, apy }: { chain: string; apy: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="best-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
        style={{
          background: "rgba(0,201,141,0.14)",
          border: "1px solid rgba(0,201,141,0.4)",
          color: "#00C98D",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: "#00C98D" }}
        />
        {chain} · {apy.toFixed(1)}%
      </span>
    </div>
  );
}

type SwapRow = ApyRow & { swap: SwapConfig };
type StakingRow = ApyRow & { stakingInfo: StakingInfo };

export function YieldTable() {
  const [swapRow, setSwapRow] = useState<SwapRow | null>(null);
  const [swapInitialAmount, setSwapInitialAmount] = useState("10");
  const [stakingRow, setStakingRow] = useState<StakingRow | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  function setAmount(symbol: string, value: string) {
    setAmounts((prev) => ({ ...prev, [symbol]: value }));
  }

  function openRow(row: ApyRow) {
    const amount = amounts[row.symbol] || "10";
    if (row.swap) { setSwapRow(row as SwapRow); setSwapInitialAmount(amount); }
    else if (row.stakingInfo) setStakingRow(row as StakingRow);
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-text-primary font-semibold text-lg">
                Live Yield Comparison
              </h2>
              <p className="text-text-secondary text-sm mt-0.5">
                Earn the most with your crypto across TON, Ethereum, Base & BNB
              </p>
            </div>
            <div
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(0,152,234,0.1)",
                border: "1px solid rgba(0,152,234,0.2)",
                color: "#8B9CBF",
              }}
            >
              MVP · hardcoded rates
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className="text-xs text-text-secondary uppercase tracking-wider"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <th className="text-left px-6 py-3 font-medium">Asset</th>
                {CHAINS.map((c) => (
                  <th key={c} className="text-center px-4 py-3 font-medium">
                    {CHAIN_LABELS[c]} APY
                  </th>
                ))}
                <th className="text-center px-4 py-3 font-medium">Best</th>
                <th className="text-right px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {APY_DATA.map((row, i) => {
                const yearly = yearlyEst(amounts[row.symbol] ?? "", row.bestApy);
                return (
                <tr
                  key={row.symbol}
                  className="transition-colors hover:bg-white/[0.02] group"
                  style={{
                    borderBottom:
                      i < APY_DATA.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  {/* Asset */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {row.icon}
                      </div>
                      <div>
                        <div className="text-text-primary font-semibold">
                          {row.symbol}
                        </div>
                        <div className="text-text-secondary text-xs">
                          {row.asset}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* APY cells */}
                  {CHAINS.map((c) => {
                    const val = row[c];
                    const isBest = c === `${row.bestChain.toLowerCase()}Apy` ||
                      (row.bestChain === "TON" && c === "tonApy") ||
                      (row.bestChain === "Ethereum" && c === "ethApy") ||
                      (row.bestChain === "Base" && c === "baseApy") ||
                      (row.bestChain === "BNB" && c === "bnbApy");
                    return (
                      <td key={c} className="px-4 py-4 text-center">
                        <ApyCell value={val} isBest={isBest} />
                      </td>
                    );
                  })}

                  {/* Best + yearly estimate */}
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex flex-col items-center gap-1">
                      <BestBadge chain={row.bestChain} apy={row.bestApy} />
                      {yearly && (
                        <span className="text-xs font-semibold" style={{ color: "#00C98D" }}>
                          {yearly}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action: amount input + button */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <input
                        type="number"
                        value={amounts[row.symbol] ?? ""}
                        onChange={(e) => setAmount(row.symbol, e.target.value)}
                        placeholder="Amount"
                        min="0"
                        step="any"
                        onClick={(e) => e.stopPropagation()}
                        className="w-24 text-right text-sm text-text-primary outline-none rounded-[8px]"
                        style={{
                          padding: "6px 10px",
                          background: "#0d0d1a",
                          border: "1px solid rgba(0,152,234,0.3)",
                        }}
                      />
                    <button
                      onClick={() => openRow(row)}
                      className="px-4 py-2 rounded-[10px] text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
                      style={{
                        background: "linear-gradient(135deg, #0098EA, #0070B8)",
                      }}
                    >
                      {row.stakingInfo ? "Stake TON" : "Swap to best"}
                    </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {APY_DATA.map((row) => {
            const yearly = yearlyEst(amounts[row.symbol] ?? "", row.bestApy);
            return (
            <div key={row.symbol} className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {row.icon}
                  </div>
                  <div>
                    <div className="text-text-primary font-semibold">{row.symbol}</div>
                    <div className="text-text-secondary text-xs">{row.asset}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <BestBadge chain={row.bestChain} apy={row.bestApy} />
                  {yearly && (
                    <span className="text-xs font-semibold" style={{ color: "#00C98D" }}>
                      {yearly}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {CHAINS.map((c) => (
                  <div
                    key={c}
                    className="rounded-[10px] p-2 text-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <div className="text-text-secondary text-xs mb-1">
                      {CHAIN_LABELS[c]}
                    </div>
                    <ApyCell
                      value={row[c]}
                      isBest={
                        (row.bestChain === "TON" && c === "tonApy") ||
                        (row.bestChain === "Ethereum" && c === "ethApy") ||
                        (row.bestChain === "Base" && c === "baseApy") ||
                        (row.bestChain === "BNB" && c === "bnbApy")
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-2.5">
                <input
                  type="number"
                  value={amounts[row.symbol] ?? ""}
                  onChange={(e) => setAmount(row.symbol, e.target.value)}
                  placeholder="Amount"
                  min="0"
                  step="any"
                  className="flex-1 text-sm text-text-primary outline-none rounded-[10px]"
                  style={{
                    padding: "6px 10px",
                    background: "#0d0d1a",
                    border: "1px solid rgba(0,152,234,0.3)",
                  }}
                />
                <button
                  onClick={() => openRow(row)}
                  className="flex-[2] py-2.5 rounded-[10px] text-sm font-medium text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #0098EA, #0070B8)" }}
                >
                  {row.stakingInfo ? "Stake TON" : "Swap to best yield"}
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {swapRow && (
        <SwapModal row={swapRow} initialAmount={swapInitialAmount} onClose={() => setSwapRow(null)} />
      )}
      {stakingRow && (
        <StakingModal row={stakingRow} onClose={() => setStakingRow(null)} />
      )}
    </>
  );
}
