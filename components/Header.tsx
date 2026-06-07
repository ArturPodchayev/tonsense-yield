"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { TonConnectButton } from "@tonconnect/ui-react";

interface HeaderProps {
  onOpenMira?: () => void;
}

export function Header({ onOpenMira }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSwap() {
    closeMenu();
    if (pathname === "/") {
      document.getElementById("yield-table")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  function handleMira() {
    closeMenu();
    if (onOpenMira) {
      onOpenMira();
    } else {
      router.push("/");
    }
  }

  const linkClass = (active: boolean) =>
    active
      ? "text-accent font-medium cursor-pointer"
      : "text-text-secondary hover:text-text-primary cursor-pointer transition-colors";

  return (
    <>
      <header
        className="relative flex items-center justify-between px-6 py-4 border-b border-white/5"
        style={{ zIndex: 50 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image src="/logo.png" alt="TonSense logo" width={36} height={36} className="rounded-full" />
          <div>
            <span className="text-text-primary font-semibold text-lg tracking-tight">TonSense</span>
            <span
              className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded-md"
              style={{ background: "rgba(0,152,234,0.15)", color: "#0098EA", border: "1px solid rgba(0,152,234,0.3)" }}
            >
              Yield
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className={linkClass(pathname === "/")}>Yields</Link>
            <span onClick={handleSwap} className={linkClass(false)}>Swap</span>
            <Link href="/about" className={linkClass(pathname === "/about")}>About</Link>
            <span onClick={onOpenMira} className={linkClass(false)}>AI Chat</span>
          </nav>

          {/* Desktop wallet */}
          <div className="hidden md:block">
            <TonConnectButton />
          </div>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ color: "#F0F4FF", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span style={{ fontSize: "17px", lineHeight: 1 }}>☰</span>
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen menu ───────────────────────────────────────── */}
      {/*
        z-index 400: above header (50) and page content, but below TonConnect
        modal (default 99999) so wallet modal appears correctly on top.
      */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 400,
          visibility: menuOpen ? "visible" : "hidden",
          transition: menuOpen ? "visibility 0s" : "visibility 0s linear 0.38s",
        }}
      >
        {/* Backdrop — tap to close */}
        <div
          onClick={closeMenu}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,8,0.7)",
            opacity: menuOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: menuOpen ? "auto" : "none",
          }}
        />

        {/* Slide-in panel */}
        <div
          style={{
            position: "absolute",
            top: 0, right: 0, bottom: 0,
            width: "100%",
            background: "rgba(6,6,22,0.98)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            borderLeft: "1px solid rgba(0,152,234,0.12)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* ── Header row: logo + close ── */}
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <Link href="/" onClick={closeMenu} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image src="/logo.png" alt="TonSense logo" width={32} height={32} className="rounded-full" />
              <span style={{ color: "#F0F4FF", fontWeight: 600, fontSize: "1rem" }}>
                TonSense <span style={{ color: "#0098EA" }}>Yield</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              style={{
                width: 38, height: 38,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F0F4FF", fontSize: "16px", cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Wallet section — TOP ── */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ color: "#8B9CBF", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Wallet
            </p>
            {/* TonConnectButton renders its own modal; z-index of that modal (99999)
                is above this overlay (400) so it will appear correctly on top. */}
            <TonConnectButton />
          </div>

          {/* ── Nav links ── */}
          <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", padding: "20px 24px" }}>
            <Link
              href="/"
              onClick={closeMenu}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", borderRadius: "14px",
                background: pathname === "/" ? "rgba(0,152,234,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${pathname === "/" ? "rgba(0,152,234,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: pathname === "/" ? "#0098EA" : "#D8E4F0",
                fontSize: "1.05rem", fontWeight: 500,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span>Yields</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </Link>

            <button
              type="button"
              onClick={handleSwap}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "18px 20px", borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#D8E4F0", fontSize: "1.05rem", fontWeight: 500, cursor: "pointer",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span>Swap</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </button>

            <Link
              href="/about"
              onClick={closeMenu}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", borderRadius: "14px",
                background: pathname === "/about" ? "rgba(0,152,234,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${pathname === "/about" ? "rgba(0,152,234,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: pathname === "/about" ? "#0098EA" : "#D8E4F0",
                fontSize: "1.05rem", fontWeight: 500,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span>About</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </Link>

            <button
              type="button"
              onClick={handleMira}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "18px 20px", borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#D8E4F0", fontSize: "1.05rem", fontWeight: 500, cursor: "pointer",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span>AI Chat</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </button>
          </nav>

          {/* ── Footer ── */}
          <div
            style={{
              padding: "16px 24px 32px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(139,156,191,0.4)", fontSize: "0.75rem" }}>
              TonSense Yield · STON.fi Hackathon Wave 2
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
