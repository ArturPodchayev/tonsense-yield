"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import type React from "react";

const PILLS = [
  { icon: "⚡", text: "Real-time yield comparison" },
  { icon: "🔄", text: "One-click Omniston swaps" },
  { icon: "🛡️", text: "Smart contract security audit" },
];

interface SplashScreenProps {
  onDismiss: () => void;
}

export function SplashScreen({ onDismiss }: SplashScreenProps) {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const [connected, setConnected] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  // Refs avoid stale-closure issues inside setTimeout callbacks
  const dismissedRef = useRef(false);
  const fadingOutRef = useRef(false);
  const hadWalletOnMount = useRef(!!wallet);

  // Detect new wallet connection → auto-dismiss
  useEffect(() => {
    if (!wallet) return;
    if (hadWalletOnMount.current) return; // wallet was already connected on mount
    if (dismissedRef.current) return;

    dismissedRef.current = true;
    setConnected(true);

    const t = setTimeout(triggerDismiss, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  function triggerDismiss() {
    if (fadingOutRef.current) return;
    fadingOutRef.current = true;
    dismissedRef.current = true;
    setFadingOut(true);
    setTimeout(() => {
      sessionStorage.setItem("tsy_onboarded", "1");
      onDismiss();
    }, 520);
  }

  function handleConnect() {
    // tonConnectUI is the TonConnectUI instance from useTonConnectUI()
    // The splash screen uses z-index 1000 (below TonConnect modal's default 99999)
    // so the modal will appear correctly above the splash.
    tonConnectUI.openModal();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        // Keep below TonConnect modal default z-index of 99999 so the modal
        // can appear on top when the user clicks "Connect Wallet & Start".
        zIndex: 1000,
        background: "#080810",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadingOut ? 0 : 1,
        transition: fadingOut ? "opacity 0.5s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: fadingOut ? "none" : "auto",
        overflow: "hidden",
      }}
    >
      {/* Orb 1 — blue, top-left */}
      <div
        className="splash-orb-1"
        style={{
          position: "absolute",
          width: 700, height: 700,
          top: -220, left: -220,
          borderRadius: "50%",
          background: "radial-gradient(circle, #0098EA, transparent 70%)",
          opacity: 0.12, filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      {/* Orb 2 — teal, bottom-right */}
      <div
        className="splash-orb-2"
        style={{
          position: "absolute",
          width: 600, height: 600,
          bottom: -160, right: -160,
          borderRadius: "50%",
          background: "radial-gradient(circle, #00D4AA, transparent 70%)",
          opacity: 0.08, filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
      {/* Orb 3 — purple, center-right */}
      <div
        className="splash-orb-3"
        style={{
          position: "absolute",
          width: 500, height: 500,
          top: "28%", right: "-8%",
          borderRadius: "50%",
          background: "radial-gradient(circle, #7B61FF, transparent 70%)",
          opacity: 0.06, filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Dot grid overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.03, pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 24px",
          width: "100%",
          maxWidth: 480,
        }}
      >
        {/* Logo */}
        <div className="splash-in" style={{ "--delay": "0.5s", marginBottom: "28px" } as React.CSSProperties}>
          <div
            className="splash-logo-glow"
            style={{
              display: "inline-block", borderRadius: "50%",
              boxShadow: "0 0 24px rgba(0,152,234,0.35), 0 0 48px rgba(0,152,234,0.12)",
            }}
          >
            <Image src="/logo.png" alt="TonSense" width={120} height={120} className="rounded-full" priority />
          </div>
        </div>

        {/* Title */}
        <div className="splash-in" style={{ "--delay": "1.5s", marginBottom: "10px" } as React.CSSProperties}>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.1, color: "#F0F4FF" }}>
            TonSense <span style={{ color: "#00E090" }}>Yield</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="splash-in" style={{ "--delay": "2.0s", marginBottom: "36px" } as React.CSSProperties}>
          <p style={{ color: "#8B9CBF", fontSize: "1.05rem", lineHeight: 1.55 }}>
            Find where your crypto earns the most
          </p>
        </div>

        {/* Divider */}
        <div style={{ marginBottom: "32px", padding: "0 32px" }}>
          <div
            className="splash-divider-line"
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0,152,234,0.55), rgba(0,212,170,0.4), transparent)",
            }}
          />
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
          {PILLS.map((pill, i) => (
            <div
              key={pill.text}
              className="splash-in"
              style={{
                "--delay": `${3.0 + i * 0.2}s`,
                display: "flex", alignItems: "center", gap: "12px",
                padding: "11px 18px", borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(0,152,234,0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                textAlign: "left",
              } as React.CSSProperties}
            >
              <span style={{ fontSize: "1.15rem", flexShrink: 0 }}>{pill.icon}</span>
              <span style={{ color: "#D8E4F0", fontSize: "0.9rem", fontWeight: 500 }}>{pill.text}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div
          className="splash-in"
          style={{ "--delay": "4.0s", display: "flex", flexDirection: "column", gap: "12px" } as React.CSSProperties}
        >
          {connected ? (
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "15px 28px", borderRadius: "14px",
                background: "rgba(0,224,144,0.12)", border: "1px solid rgba(0,224,144,0.4)",
                color: "#00E090", fontSize: "1rem", fontWeight: 600,
              }}
            >
              <span>✓</span>
              <span>Wallet connected!</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={handleConnect}
                className="btn-action"
                style={{
                  width: "100%",
                  padding: "15px 28px", borderRadius: "14px",
                  background: "linear-gradient(135deg, #0098EA 0%, #00B8A0 50%, #00D4AA 100%)",
                  border: "none", color: "white",
                  fontSize: "1rem", fontWeight: 600, cursor: "pointer",
                  boxShadow: "0 4px 24px rgba(0,152,234,0.4), 0 0 0 1px rgba(0,152,234,0.2) inset",
                  letterSpacing: "-0.01em",
                }}
              >
                Connect Wallet &amp; Start
              </button>
              <button
                type="button"
                onClick={triggerDismiss}
                className="btn-action"
                style={{
                  width: "100%",
                  padding: "13px 28px", borderRadius: "14px",
                  background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#8B9CBF", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer",
                  letterSpacing: "-0.005em",
                }}
              >
                Explore without wallet →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
