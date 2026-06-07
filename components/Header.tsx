"use client";

import { TonConnectButton } from "@tonconnect/ui-react";

export function Header() {
  return (
    <header className="relative flex items-center justify-between px-6 py-4 border-b border-white/5" style={{ zIndex: 10 }}>
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "linear-gradient(135deg, #0098EA, #00C98D)" }}
        >
          T
        </div>
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
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <span className="text-accent font-medium cursor-pointer">Yields</span>
          <span className="hover:text-text-primary cursor-pointer transition-colors">
            Swap
          </span>
          <span className="hover:text-text-primary cursor-pointer transition-colors">
            AI Chat
          </span>
        </nav>
        <TonConnectButton />
      </div>
    </header>
  );
}
