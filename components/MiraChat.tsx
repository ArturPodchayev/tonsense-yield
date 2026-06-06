"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const ALLOWED_TOPICS = /yield|apy|defi|ton|eth|bnb|base|usdt|usdc|stake|swap|chain|crypto|earn|liquidity|pool|protocol|tonstakers|omniston|return|rate|risk|safe/i;

const MIRA_RESPONSES: Record<string, string> = {
  default:
    "I can help with TON DeFi and yield strategy questions. Try asking why TON yields are high, or whether a crosschain swap is safe.",
  "ton yield":
    "TON currently offers ~5.2% APY via Tonstakers — one of the highest liquid staking rates in the ecosystem. This is driven by validator rewards + MEV + protocol incentives on a relatively young chain.",
  "usdt":
    "USDT on TON earns ~4.1% APY, beating Ethereum (~2.8%) and BNB Chain (~3.2%). The higher rate reflects lower liquidity competition and growing TVL demand on TON.",
  "usdc":
    "USDC earns ~4.0% on TON, ~3.6% on Base, and ~2.9% on Ethereum. TON's DeFi ecosystem is less saturated, so early liquidity providers capture better yields.",
  "crosschain":
    "Omniston RFQ routes your swap through audited solvers with transaction simulation before confirmation. The main risks are smart contract risk and bridge finality — always verify the destination chain and use small amounts first.",
  "safe":
    "Crosschain swaps via Omniston include pre-execution simulation. That said, always check: (1) is the protocol audited? (2) is TVL sufficient? (3) what's the bridge latency? For amounts >$1000, split into smaller batches.",
  "why ton":
    "TON yield is higher than ETH right now because: (1) validator APY is ~5% base, (2) the chain is growing fast with new protocols competing for liquidity, and (3) stETH on Ethereum compresses ETH yield toward ~3–4%.",
};

function getMiraReply(input: string): string {
  const lower = input.toLowerCase();
  if (!ALLOWED_TOPICS.test(lower)) {
    return "I'm focused on TON DeFi and yield topics. Ask me about APY rates, crosschain swaps, staking, or protocol safety.";
  }
  for (const [key, val] of Object.entries(MIRA_RESPONSES)) {
    if (key !== "default" && lower.includes(key)) return val;
  }
  return MIRA_RESPONSES.default;
}

interface MiraChatProps {
  onClose: () => void;
}

export function MiraChat({ onClose }: MiraChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm Mira, your TON DeFi assistant. Ask me about yields, crosschain swaps, or protocol safety.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    setTyping(false);
    setMessages((m) => [...m, { role: "ai", text: getMiraReply(text) }]);
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex flex-col glass-card overflow-hidden"
      style={{
        width: 360,
        height: 500,
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
            <div className="text-green-yield text-xs flex items-center gap-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "#00C98D" }}
              />
              TON DeFi expert
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
              className="max-w-[85%] rounded-[14px] px-3 py-2 text-sm"
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

      {/* Suggestions */}
      <div
        className="px-4 py-2 flex gap-2 overflow-x-auto"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {[
          "Why is TON yield high?",
          "Is crosschain swap safe?",
          "Best USDT yield?",
        ].map((s) => (
          <button
            key={s}
            onClick={() => {
              setInput(s);
            }}
            className="whitespace-nowrap text-xs px-2.5 py-1.5 rounded-full transition-colors hover:opacity-80"
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
          placeholder="Ask about TON yields…"
          className="flex-1 bg-transparent text-text-primary text-sm outline-none placeholder-text-secondary"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
          style={{ background: "#0098EA" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7 1l6 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
