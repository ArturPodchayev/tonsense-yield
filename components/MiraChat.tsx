"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const ALLOWED_TOPICS =
  /yield|apy|defi|ton|eth|bnb|base|usdt|usdc|stake|swap|chain|crypto|earn|liquidity|pool|protocol|tonstakers|omniston|tonsense|tonsec|tonviewer|return|rate|risk|safe|crosschain|bridge|resolver|rfq|wallet|connect|balance|audit|security/i;

// Ordered from most specific to least — first match wins
const MIRA_RESPONSES: [string, string][] = [
  [
    "how does swap work",
    "TonSense uses Omniston RFQ — a WebSocket request-for-quote system. When you click Swap, professional resolvers compete to fill your order. The best quote appears in seconds, you confirm, TON Connect signs the transaction, and it's broadcast on-chain. Verified: 2 USDT → 1.205 TON on Tonviewer.",
  ],
  [
    "swap work",
    "TonSense uses Omniston RFQ — a WebSocket request-for-quote system. When you click Swap, professional resolvers compete to fill your order. The best quote appears in seconds, you confirm, TON Connect signs the transaction, and it's broadcast on-chain. Verified: 2 USDT → 1.205 TON on Tonviewer.",
  ],
  [
    "best yield",
    "Right now: TON earns 5.2% APY via Tonstakers (liquid staking, no lockup). USDT earns 4.1% on TON vs 2.8% on Ethereum. USDC earns 4.0% on TON vs 2.9% on Ethereum. TON chain leads across all three assets on TonSense Yield.",
  ],
  [
    "tonsense",
    "TonSense Yield is a cross-chain yield comparator live at tonsense-yield.vercel.app. It shows you where USDT, USDC, and TON earn the highest APY across TON, Ethereum, Base, and BNB — then lets you swap to the best rate in one click via Omniston.",
  ],
  [
    "omniston",
    "Omniston is STON.fi's decentralized swap protocol on TON. It uses RFQ (request-for-quote) where resolvers compete to fill your swap. Intrachain swaps use SWAP settlement (instant via STON.fi AMM). Crosschain swaps use ORDER settlement with HTLC escrow — atomic, no custodian, no bridge risk.",
  ],
  [
    "tonstakers",
    "Tonstakers is the leading liquid staking protocol on TON with $180M+ TVL. Stake TON, receive tsTON — a yield-bearing token that accrues 5.2% APY. No lockup, unstake anytime. Audited by CertiK and Quantstamp, zero exploits since launch in 2022.",
  ],
  [
    "tonsec",
    "TonSense shows a security rating for each protocol — Low, Medium, or High risk. Click the 🛡️ shield next to any asset to see the full report: audit history, key findings, and contract address. Ratings are powered by static analysis via Tonsec.",
  ],
  [
    "audit",
    "TonSense shows a security rating for each protocol — Low, Medium, or High risk. Click the 🛡️ shield next to any asset to see the full report: audit history, key findings, and contract address. Ratings are powered by static analysis via Tonsec.",
  ],
  [
    "security",
    "TonSense shows a security rating for each protocol — Low, Medium, or High risk. Click the 🛡️ shield next to any asset to see the full report: audit history, key findings, and contract address. Ratings are powered by static analysis via Tonsec.",
  ],
  [
    "safe",
    "TonSense Yield uses security audits powered by Tonsec. Tonstakers is Low risk (audited by CertiK & Quantstamp, 2+ years live, no exploits). STON.fi USDT swaps are Low risk (battle-tested AMM). USDC crosschain is Medium risk — bridge complexity adds surface area. Start with a small amount.",
  ],
  [
    "risk",
    "Each protocol on TonSense has a risk rating: Tonstakers = Low (audited, 2+ years live), STON.fi swap = Low (battle-tested), Omniston crosschain = Medium (bridge adds complexity). Click 🛡️ on any row for the full security breakdown.",
  ],
  [
    "ton yield",
    "TON currently offers ~5.2% APY via Tonstakers — the highest on TonSense Yield. This comes from validator rewards, MEV, and protocol incentives on a fast-growing chain with less liquidity competition than Ethereum.",
  ],
  [
    "usdt",
    "USDT on TON earns ~4.1% APY — the best across all 4 chains on TonSense Yield. Ethereum offers 2.8%, Base 3.5%, BNB 3.2%. Swap your USDT → native TON via Omniston to capture the yield difference in one click.",
  ],
  [
    "usdc",
    "USDC earns ~4.0% on TON, ~3.6% on Base, ~2.9% on Ethereum, ~3.1% on BNB. TON's DeFi ecosystem is less saturated, so early liquidity providers capture better yields. Crosschain swap via Omniston ORDER (HTLC) settlement.",
  ],
  [
    "crosschain",
    "Crosschain swaps use Omniston ORDER settlement — HTLC-based atomic swaps. Resolvers lock funds on both chains simultaneously, so there's no custodian. The supported crosschain pair on TonSense is USDC on TON → USDC on Base.",
  ],
  [
    "why ton",
    "TON yield beats Ethereum because: (1) validator APY is ~5% base, (2) growing ecosystem with protocols competing for liquidity, (3) stETH already compresses ETH yield to ~3–4%, (4) STON.fi and Tonstakers are in early growth — first movers get the best rates.",
  ],
  [
    "default",
    "I can help with TonSense Yield, TON DeFi, APY rates, swaps, staking, and protocol safety. Try one of the quick replies below, or ask me anything about yields!",
  ],
];

function getMiraReply(input: string): string {
  const lower = input.toLowerCase();
  if (!ALLOWED_TOPICS.test(lower)) {
    return "I'm focused on TonSense Yield and TON DeFi topics. Ask me about APY rates, how swaps work, protocol safety, or what Omniston is.";
  }
  for (const [key, val] of MIRA_RESPONSES) {
    if (key !== "default" && lower.includes(key)) return val;
  }
  return MIRA_RESPONSES[MIRA_RESPONSES.length - 1][1];
}

const QUICK_REPLIES = [
  "Best yield right now?",
  "How does swap work?",
  "Is it safe?",
  "What is Omniston?",
];

interface MiraChatProps {
  onClose: () => void;
}

export function MiraChat({ onClose }: MiraChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm Mira, the AI assistant for TonSense Yield. I know everything about the app, TON DeFi, Omniston swaps, and yield rates across chains. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    setTyping(false);
    setMessages((m) => [...m, { role: "ai", text: getMiraReply(trimmed) }]);
  }

  async function sendMessage() {
    await sendText(input);
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col glass-card overflow-hidden"
      style={{
        width: 360,
        height: 520,
        boxShadow: "0 0 40px rgba(0,152,234,0.15)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #0098EA, #00C98D)" }}
          >
            M
          </div>
          <div>
            <div className="text-text-primary text-sm font-semibold">Mira AI</div>
            <div className="text-xs flex items-center gap-1" style={{ color: "#00E090" }}>
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "#00E090" }}
              />
              TonSense Yield assistant
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[85%] rounded-[14px] px-3 py-2 text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? {
                      background: "rgba(0,152,234,0.2)",
                      border: "1px solid rgba(0,152,234,0.3)",
                      color: "#F0F4FF",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#F0F4FF",
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div
              className="rounded-[14px] px-3 py-2 text-sm text-text-secondary"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="animate-pulse">Mira is thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div
        className="px-4 py-2 flex gap-2 overflow-x-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {QUICK_REPLIES.map((s) => (
          <button
            key={s}
            onClick={() => sendText(s)}
            className="whitespace-nowrap text-xs px-2.5 py-1.5 rounded-full transition-all hover:opacity-80 active:scale-95"
            style={{
              background: "rgba(0,152,234,0.1)",
              border: "1px solid rgba(0,152,234,0.2)",
              color: "#0098EA",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 flex gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about TonSense Yield…"
          className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder-text-secondary"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || typing}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
          style={{ background: "#0098EA" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 7h12M7 1l6 6-6 6"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
