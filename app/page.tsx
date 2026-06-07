"use client";

import { useState } from "react";
import type React from "react";
import { Header } from "@/components/Header";
import { YieldTable } from "@/components/YieldTable";
import { StatsBar } from "@/components/StatsBar";
import { MiraChat } from "@/components/MiraChat";

export default function Home() {
  const [miraOpen, setMiraOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Header onOpenMira={() => setMiraOpen(true)} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="relative text-center py-14 md:py-20 overflow-hidden rounded-2xl">
          {/* Animated background orbs */}
          <div
            className="hero-orb absolute w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              top: "-120px", left: "5%",
              background: "radial-gradient(circle, #0098EA, transparent 70%)",
              opacity: 0.12, filter: "blur(70px)",
            }}
          />
          <div
            className="hero-orb-b absolute w-[320px] h-[320px] rounded-full pointer-events-none"
            style={{
              bottom: "-100px", right: "8%",
              background: "radial-gradient(circle, #00D4AA, transparent 70%)",
              opacity: 0.12, filter: "blur(60px)",
            }}
          />

          {/* Content */}
          <div className="relative" style={{ zIndex: 1 }}>
            <h1
              className="anim-up text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight leading-tight"
              style={{ "--delay": "0.1s" } as React.CSSProperties}
            >
              Find where your crypto{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0098EA, #00D4AA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                earns the most
              </span>
            </h1>
            <p
              className="anim-up text-text-secondary text-lg max-w-xl mx-auto leading-relaxed"
              style={{ "--delay": "0.3s" } as React.CSSProperties}
            >
              Cross-chain yield comparator built on Omniston. Swap to the best
              rate in one click.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="anim-down" style={{ "--delay": "0.2s" } as React.CSSProperties}>
          <StatsBar />
        </div>

        {/* Yield Table */}
        <div id="yield-table">
          <YieldTable />
        </div>

        {/* Footer note */}
        <div
          className="text-center text-text-secondary text-sm py-8 mt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="mb-1">
            APY data sourced from{" "}
            <span className="text-text-primary font-medium">Tonstakers</span>
            {" · "}
            <span className="text-text-primary font-medium">DeFiLlama</span>
            {" · "}
            Swaps via <span className="text-accent font-medium">Omniston</span>
          </p>
          <p style={{ color: "rgba(139,156,191,0.55)", fontSize: "12px" }}>
            Part of the TonSense ecosystem · Built for STON.fi Vibe Coding Hackathon Wave 2
          </p>
        </div>
      </main>

      {/* Mira AI floating button */}
      {!miraOpen && (
        <button
          onClick={() => setMiraOpen(true)}
          className="mira-pulse fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-medium text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #0098EA, #00C98D)" }}
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
