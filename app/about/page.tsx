import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AnimatedSection } from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "About — TonSense Yield",
  description:
    "Built for TON. Powered by Omniston. TonSense Yield is a cross-chain yield comparator that shows where your crypto earns the most.",
};

const STEPS = [
  {
    icon: "🔍",
    title: "Compare",
    description:
      "See APY across TON, Ethereum, Base & BNB in real time. Identify the chain where your USDT, USDC, or TON earns the most.",
  },
  {
    icon: "⚡",
    title: "Swap",
    description:
      "One-click swap to the best yield via Omniston RFQ. Professional resolvers compete to fill your order. Verified on-chain.",
  },
  {
    icon: "🛡️",
    title: "Stay safe",
    description:
      "Smart contract security audit for every protocol — Low, Medium, or High risk with detailed findings powered by Tonsec.",
  },
];

const TECH = [
  { label: "Next.js 14",      color: "#F0F4FF", bg: "rgba(255,255,255,0.08)",  border: "rgba(255,255,255,0.12)" },
  { label: "TON Connect 2.0", color: "#0098EA", bg: "rgba(0,152,234,0.1)",    border: "rgba(0,152,234,0.25)"  },
  { label: "Omniston SDK",    color: "#0098EA", bg: "rgba(0,152,234,0.1)",    border: "rgba(0,152,234,0.25)"  },
  { label: "Mira AI",         color: "#00E090", bg: "rgba(0,224,144,0.1)",    border: "rgba(0,224,144,0.25)"  },
  { label: "Tonsec",          color: "#00E090", bg: "rgba(0,224,144,0.1)",    border: "rgba(0,224,144,0.25)"  },
  { label: "Vercel",          color: "#F0F4FF", bg: "rgba(255,255,255,0.08)",  border: "rgba(255,255,255,0.12)" },
];

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ArturPodchayev/tonsense-yield",
    icon: "⬡",
    bg: "rgba(255,255,255,0.06)",
    border: "rgba(255,255,255,0.12)",
    color: "#F0F4FF",
  },
  {
    label: "Live App",
    href: "https://tonsense-yield.vercel.app",
    icon: "🚀",
    bg: "rgba(0,152,234,0.12)",
    border: "rgba(0,152,234,0.3)",
    color: "#0098EA",
  },
  {
    label: "TonSense",
    href: "https://tonsense.app",
    icon: "💎",
    bg: "rgba(0,224,144,0.1)",
    border: "rgba(0,224,144,0.25)",
    color: "#00E090",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">

        {/* ── Back button ── */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75 active:opacity-60"
            style={{
              color: "#8B9CBF",
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            ← Back to App
          </Link>
        </div>

        {/* ── Hero ── */}
        <section className="relative text-center py-14 md:py-20 overflow-hidden rounded-2xl">
          <div
            className="hero-orb absolute w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{
              top: "-100px", left: "0%",
              background: "radial-gradient(circle, #0098EA, transparent 70%)",
              opacity: 0.11, filter: "blur(70px)",
            }}
          />
          <div
            className="hero-orb-b absolute w-[280px] h-[280px] rounded-full pointer-events-none"
            style={{
              bottom: "-80px", right: "5%",
              background: "radial-gradient(circle, #00D4AA, transparent 70%)",
              opacity: 0.11, filter: "blur(60px)",
            }}
          />
          <div className="relative" style={{ zIndex: 1 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight leading-tight">
              Built for{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0098EA, #00D4AA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                TON.
              </span>{" "}
              Powered by{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #00D4AA, #00E090)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Omniston.
              </span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
              TonSense Yield is a cross-chain yield comparator that shows where
              your crypto earns the most — and lets you swap there in one click.
            </p>
          </div>
        </section>

        {/* ── The Problem ── */}
        <AnimatedSection delay={0}>
        <section className="glass-card px-8 py-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#0098EA" }}
          >
            The Problem
          </p>
          <p className="text-text-primary text-xl leading-relaxed font-medium">
            Most TON holders don&apos;t know they&apos;re leaving money on the table.
          </p>
          <p className="text-text-secondary text-base leading-relaxed mt-3">
            Yield rates vary across chains, but comparing them manually is
            painful — different interfaces, different wallets, different bridges.
            We built TonSense Yield to solve that.
          </p>
        </section>
        </AnimatedSection>

        {/* ── How it works ── */}
        <AnimatedSection delay={0.05}>
        <section>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#0098EA" }}
          >
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="glass-card px-5 py-6 flex flex-col gap-3"
              >
                <div className="text-4xl">{step.icon}</div>
                <div className="text-text-primary font-semibold text-lg">
                  {step.title}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
        </AnimatedSection>

        {/* ── Tech stack ── */}
        <AnimatedSection delay={0.05}>
        <section className="glass-card px-8 py-7">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#0098EA" }}
          >
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-3">
            {TECH.map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center px-3.5 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  color: t.color,
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </section>
        </AnimatedSection>

        {/* ── Built by ── */}
        <AnimatedSection delay={0.05}>
        <section className="glass-card px-8 py-7">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#0098EA" }}
          >
            Built by
          </p>
          <p className="text-text-primary text-base leading-relaxed">
            Built by{" "}
            <span className="font-semibold text-text-primary">
              Artur Podchayev
            </span>{" "}
            &amp;{" "}
            <span className="font-semibold text-text-primary">
              Muhammadjon Mirzotilloev
            </span>{" "}
            during{" "}
            <span
              className="font-semibold"
              style={{ color: "#0098EA" }}
            >
              STON.fi Vibe Coding Hackathon Wave 2
            </span>
            , June 2026. Part of the{" "}
            <span className="font-semibold" style={{ color: "#00E090" }}>
              TonSense
            </span>{" "}
            ecosystem — a suite of DeFi tools built for the TON blockchain.
          </p>
        </section>
        </AnimatedSection>

        {/* ── Links ── */}
        <AnimatedSection delay={0.05}>
        <section>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#0098EA" }}
          >
            Links
          </p>
          <div className="flex flex-wrap gap-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-sm font-semibold hover:opacity-85"
                style={{
                  background: link.bg,
                  border: `1px solid ${link.border}`,
                  color: link.color,
                }}
              >
                <span>{link.icon}</span>
                {link.label}
                <span className="opacity-60 text-xs">↗</span>
              </a>
            ))}
          </div>
        </section>
        </AnimatedSection>

        {/* Footer */}
        <div
          className="text-center text-text-secondary text-sm py-8 mt-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p>
            Part of the TonSense ecosystem · Built for{" "}
            <span className="text-accent font-medium">STON.fi</span> Vibe
            Coding Hackathon Wave 2
          </p>
        </div>

      </main>
    </div>
  );
}
