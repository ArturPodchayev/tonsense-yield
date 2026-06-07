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

  const mobileLinkBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "16px 20px",
    borderRadius: "14px",
    fontSize: "1.1rem",
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)",
    transition: "background 0.15s ease, border-color 0.15s ease",
  };

  const mobileLinkActive: React.CSSProperties = {
    ...mobileLinkBase,
    background: "rgba(0,152,234,0.1)",
    border: "1px solid rgba(0,152,234,0.25)",
    color: "#0098EA",
  };

  const mobileLinkInactive: React.CSSProperties = {
    ...mobileLinkBase,
    color: "#D8E4F0",
  };

  return (
    <>
      <header
        className="relative flex items-center justify-between px-6 py-4 border-b border-white/5"
        style={{ zIndex: 50 }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <Image
            src="/logo.png"
            alt="TonSense logo"
            width={36}
            height={36}
            className="rounded-full"
          />
          <div>
            <span className="text-text-primary font-semibold text-lg tracking-tight">
              TonSense
            </span>
            <span
              className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded-md"
              style={{
                background: "rgba(0,152,234,0.15)",
                color: "#0098EA",
                border: "1px solid rgba(0,152,234,0.3)",
              }}
            >
              Yield
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className={linkClass(pathname === "/")}>
              Yields
            </Link>
            <span onClick={handleSwap} className={linkClass(false)}>
              Swap
            </span>
            <Link href="/about" className={linkClass(pathname === "/about")}>
              About
            </Link>
            <span onClick={onOpenMira} className={linkClass(false)}>
              AI Chat
            </span>
          </nav>

          {/* Desktop wallet */}
          <div className="hidden md:block">
            <TonConnectButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              color: "#F0F4FF",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
            }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span style={{ fontSize: "17px", lineHeight: 1 }}>☰</span>
          </button>
        </div>
      </header>

      {/* ── Mobile menu overlay ────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 300,
          // Keep in DOM for animation; hide from a11y when closed
          visibility: menuOpen ? "visible" : "hidden",
          transition: menuOpen ? "visibility 0s" : "visibility 0s linear 0.38s",
        }}
      >
        {/* Backdrop */}
        <div
          onClick={closeMenu}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,8,0.65)",
            opacity: menuOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: menuOpen ? "auto" : "none",
          }}
        />

        {/* Slide-in panel */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            maxWidth: "100vw",
            background: "rgba(6,6,20,0.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderLeft: "1px solid rgba(0,152,234,0.12)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            flexDirection: "column",
            padding: "24px",
            overflowY: "auto",
          }}
        >
          {/* Top row: logo + close */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "36px",
            }}
          >
            <Link
              href="/"
              onClick={closeMenu}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Image
                src="/logo.png"
                alt="TonSense logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span style={{ color: "#F0F4FF", fontWeight: 600, fontSize: "1rem" }}>
                TonSense <span style={{ color: "#0098EA" }}>Yield</span>
              </span>
            </Link>

            <button
              onClick={closeMenu}
              aria-label="Close menu"
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#F0F4FF",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
            <Link
              href="/"
              onClick={closeMenu}
              style={pathname === "/" ? mobileLinkActive : mobileLinkInactive}
            >
              <span>Yields</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </Link>

            <button onClick={handleSwap} style={mobileLinkInactive}>
              <span>Swap</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </button>

            <Link
              href="/about"
              onClick={closeMenu}
              style={pathname === "/about" ? mobileLinkActive : mobileLinkInactive}
            >
              <span>About</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </Link>

            <button onClick={handleMira} style={mobileLinkInactive}>
              <span>AI Chat</span>
              <span style={{ opacity: 0.4, fontSize: "0.9rem" }}>→</span>
            </button>
          </nav>

          {/* Wallet button */}
          <div
            style={{
              paddingTop: "28px",
              marginTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p
              style={{
                color: "#8B9CBF",
                fontSize: "0.75rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
              }}
            >
              Wallet
            </p>
            <TonConnectButton />
          </div>
        </div>
      </div>
    </>
  );
}
