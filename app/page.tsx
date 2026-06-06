"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { YieldTable } from "@/components/YieldTable";
import { StatsBar } from "@/components/StatsBar";
import { MiraChat } from "@/components/MiraChat";

export default function Home() {
  const [miraOpen, setMiraOpen] = useState(false);

  return (
    <div className="relative min-h-screen z-10">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="text-center py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3 tracking-tight">
            Find where your crypto{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #0098EA, #00C98D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              earns the most
            </span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Cross-chain yield comparator built on Omniston. Swap to the best
            rate in one click.
          </p>
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Yield Table */}
        <YieldTable />

        {/* Footer note */}
        <p className="text-center text-text-secondary text-sm pb-4">
          APY data sourced from{" "}
          <span className="text-text-primary">Tonstakers</span> ·{" "}
          <span className="text-text-primary">DeFiLlama</span> · Swaps via{" "}
          <span className="text-accent">Omniston</span>
        </p>
      </main>

      {/* Mira AI floating button */}
      {!miraOpen && (
        <button
          onClick={() => setMiraOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg font-medium text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #0098EA, #00C98D)",
            boxShadow: "0 0 24px rgba(0,152,234,0.35)",
          }}
        >
          <span className="text-sm font-bold">M</span>
          <span className="text-sm">Ask Mira AI</span>
        </button>
      )}

      {/* Mira Chat Sidebar */}
      {miraOpen && <MiraChat onClose={() => setMiraOpen(false)} />}
    </div>
  );
}
