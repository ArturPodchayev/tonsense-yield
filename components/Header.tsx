"use client";

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

  function handleSwap() {
    if (pathname === "/") {
      document.getElementById("yield-table")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
    }
  }

  const linkClass = (active: boolean) =>
    active
      ? "text-accent font-medium cursor-pointer"
      : "text-text-secondary hover:text-text-primary cursor-pointer transition-colors";

  return (
    <header
      className="relative flex items-center justify-between px-6 py-4 border-b border-white/5"
      style={{ zIndex: 10 }}
    >
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
        <TonConnectButton />
      </div>
    </header>
  );
}
