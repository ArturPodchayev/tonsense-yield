"use client";

import { useState } from "react";
import { APY_DATA, CHAIN_LABELS, type ApyRow, type ChainKey, type SwapConfig, type StakingInfo } from "@/lib/apyData";
import { SwapModal } from "./SwapModal";
import { StakingModal } from "./StakingModal";

const CHAINS: ChainKey[] = ["tonApy", "ethApy", "baseApy", "bnbApy"];

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
        className="best-badge inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{
          background: "rgba(0,201,141,0.12)",
          border: "1px solid rgba(0,201,141,0.35)",
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
  const [stakingRow, setStakingRow] = useState<StakingRow | null>(null);

  function openRow(row: ApyRow) {
    if (row.swap) setSwapRow(row as SwapRow);
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
              {APY_DATA.map((row, i) => (
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

                  {/* Best */}
                  <td className="px-4 py-4 text-center">
                    <BestBadge chain={row.bestChain} apy={row.bestApy} />
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openRow(row)}
                      className="px-4 py-2 rounded-[10px] text-sm font-medium text-white transition-all hover:opacity-90 active:scale-[0.97]"
                      style={{
                        background: "linear-gradient(135deg, #0098EA, #007bc4)",
                      }}
                    >
                      {row.stakingInfo ? "Stake TON" : "Swap to best"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {APY_DATA.map((row) => (
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
                <BestBadge chain={row.bestChain} apy={row.bestApy} />
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

              <button
                onClick={() => openRow(row)}
                className="w-full py-2.5 rounded-[10px] text-sm font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #0098EA, #007bc4)" }}
              >
                {row.stakingInfo ? "Stake TON" : "Swap to best yield"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {swapRow && (
        <SwapModal row={swapRow} onClose={() => setSwapRow(null)} />
      )}
      {stakingRow && (
        <StakingModal row={stakingRow} onClose={() => setStakingRow(null)} />
      )}
    </>
  );
}
