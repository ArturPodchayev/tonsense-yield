"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import {
  useRfq,
  useOmniston,
  type QuoteEvent,
  SettlementMethod,
} from "@ston-fi/omniston-sdk-react";
import type { Quote } from "@ston-fi/omniston-sdk";
import type { ApyRow } from "@/lib/apyData";

interface SwapModalProps {
  row: ApyRow;
  onClose: () => void;
}

// Token decimals on TON
const DECIMALS: Record<string, number> = {
  TON: 9,
  USDT: 6,
  USDC: 6,
};

// Omniston asset IDs for TON chain
const TON_ASSET_ID = {
  chain: { $case: "ton" as const, value: { kind: { $case: "native" as const, value: {} } } },
};

const JETTON_ASSET_ID = (address: string) => ({
  chain: { $case: "ton" as const, value: { kind: { $case: "jetton" as const, value: address } } },
});

function getAssetId(symbol: string, contractAddress?: string) {
  if (symbol === "TON") return TON_ASSET_ID;
  return JETTON_ASSET_ID(contractAddress!);
}

// Convert hex BoC string to base64 (TON Connect format)
function hexToBase64(hex: string): string {
  let binary = "";
  for (let i = 0; i < hex.length; i += 2) {
    binary += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return btoa(binary);
}

function formatUnits(raw: string, decimals: number): string {
  const n = BigInt(raw);
  const factor = BigInt(10 ** decimals);
  const whole = n / factor;
  const frac = n % factor;
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

function toUnits(amount: string, decimals: number): string {
  const [whole, frac = ""] = amount.split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(fracPadded || "0")).toString();
}

type Step = "idle" | "quoting" | "quoted" | "building" | "sending" | "done" | "error";

export function SwapModal({ row, onClose }: SwapModalProps) {
  const [amount, setAmount] = useState("10");
  const [step, setStep] = useState<Step>("idle");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState("");

  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const omniston = useOmniston();

  const isConnected = Boolean(userAddress);

  // Build the RFQ request — enabled only while quoting
  const inputUnits = (() => {
    try { return toUnits(amount || "0", DECIMALS[row.symbol] ?? 9); }
    catch { return "0"; }
  })();

  const rfqRequest = {
    inputAsset: getAssetId(row.symbol, row.contractAddress),
    outputAsset: TON_ASSET_ID, // swap any asset → TON (stake via Tonstakers)
    amount: { $case: "inputUnits" as const, value: inputUnits },
    settlementParams: [
      { params: { $case: "swap" as const, value: { maxPriceSlippagePips: 50000 } } },
    ],
  };

  const rfq = useRfq(rfqRequest, { enabled: step === "quoting" });

  // Watch for incoming quotes from the RFQ stream
  useEffect(() => {
    if (step !== "quoting") return;
    const event = rfq.data as QuoteEvent | undefined;
    if (!event) return;

    if (event.event.$case === "quoteUpdated") {
      setQuote(event.event.value);
      setStep("quoted");
    } else if (event.event.$case === "noQuote") {
      setErrorMsg("No quote available for this pair right now. Try a smaller amount or check back later.");
      setStep("error");
    }
  }, [rfq.data, step]);

  async function handleGetQuote() {
    if (!isConnected) {
      tonConnectUI.openModal();
      return;
    }
    setQuote(null);
    setErrorMsg("");
    setStep("quoting");
  }

  async function handleConfirmSwap() {
    if (!quote || !userAddress) return;
    setStep("building");

    try {
      const tonTx = await omniston.tonBuildSwap({
        quoteId: quote.quoteId,
        transferSrcAddress: { chain: { $case: "ton", value: userAddress } },
        useRecommendedSlippage: true,
      });

      setStep("sending");

      const tcMessages = tonTx.messages.map((msg) => ({
        address: msg.targetAddress,
        amount: msg.sendAmount,
        ...(msg.payload ? { payload: hexToBase64(msg.payload) } : {}),
        ...(msg.jettonWalletStateInit ? { stateInit: hexToBase64(msg.jettonWalletStateInit) } : {}),
      }));

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: tcMessages,
      });

      // result.boc is the signed BoC — extract hash for tonviewer link
      const bocBytes = Uint8Array.from(atob(result.boc), (c) => c.charCodeAt(0));
      const hashHex = Array.from(bocBytes.slice(0, 32))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setTxHash(hashHex);
      setStep("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg.includes("User rejects") ? "Transaction cancelled." : msg);
      setStep("error");
    }
  }

  const decimals = DECIMALS[row.symbol] ?? 9;
  const estimatedYield =
    amount && !isNaN(Number(amount))
      ? ((Number(amount) * row.bestApy) / 100).toFixed(2)
      : "0.00";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,8,16,0.88)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card w-full max-w-md p-6 relative"
        style={{ boxShadow: "0 0 60px rgba(0,152,234,0.14)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold text-text-primary mb-1">
          Swap to Best Yield
        </h2>
        <p className="text-text-secondary text-sm mb-5">
          Route{" "}
          <span className="text-accent font-medium">{row.symbol}</span> → TON staking via{" "}
          <span className="text-accent font-medium">Omniston RFQ</span> to earn{" "}
          <span style={{ color: "#00C98D" }} className="font-medium">{row.bestApy}% APY</span>
        </p>

        {/* From */}
        <label className="text-xs text-text-secondary mb-1.5 block">You send</label>
        <div
          className="flex items-center gap-3 rounded-[14px] px-4 py-3 mb-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="text-xl">{row.icon}</span>
          <div className="flex-1">
            <div className="text-text-secondary text-xs">Your wallet · {row.bestChain}</div>
            <div className="text-text-primary font-medium">{row.symbol}</div>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value); setStep("idle"); setQuote(null); }}
            disabled={step !== "idle" && step !== "error"}
            className="bg-transparent text-right text-text-primary font-medium w-24 outline-none disabled:opacity-60"
            min="0"
            step="0.1"
          />
        </div>

        <div className="flex justify-center my-2 text-text-secondary text-sm">↓</div>

        {/* To */}
        <label className="text-xs text-text-secondary mb-1.5 block">You receive (staked TON)</label>
        <div
          className="flex items-center gap-3 rounded-[14px] px-4 py-3 mb-5"
          style={{ background: "rgba(0,201,141,0.06)", border: "1px solid rgba(0,201,141,0.2)" }}
        >
          <span className="text-xl">💎</span>
          <div className="flex-1">
            <div className="text-text-secondary text-xs">TON · Tonstakers</div>
            <div className="text-text-primary font-medium">TON</div>
          </div>
          <div className="text-right">
            {quote ? (
              <>
                <div style={{ color: "#00C98D" }} className="font-semibold">
                  ~{formatUnits(quote.outputUnits, 9)}
                </div>
                <div className="text-text-secondary text-xs">TON out</div>
              </>
            ) : (
              <>
                <div style={{ color: "#00C98D" }} className="font-semibold">{row.bestApy}%</div>
                <div className="text-text-secondary text-xs">APY</div>
              </>
            )}
          </div>
        </div>

        {/* Quote details when available */}
        {quote && step === "quoted" && (
          <div
            className="rounded-[14px] px-4 py-3 mb-4 space-y-1.5 text-sm"
            style={{ background: "rgba(0,152,234,0.06)", border: "1px solid rgba(0,152,234,0.15)" }}
          >
            <div className="flex justify-between">
              <span className="text-text-secondary">Input</span>
              <span className="text-text-primary">{formatUnits(quote.inputUnits, decimals)} {row.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Output</span>
              <span className="text-text-primary">{formatUnits(quote.outputUnits, 9)} TON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Resolver</span>
              <span className="text-accent">{quote.resolverName || quote.resolverId.slice(0, 12) + "…"}</span>
            </div>
            {quote.gasBudget && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Gas budget</span>
                <span className="text-text-primary">{formatUnits(quote.gasBudget, 9)} TON</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Route</span>
              <span className="text-accent text-xs">Omniston RFQ ✓</span>
            </div>
          </div>
        )}

        {/* Yearly yield estimate */}
        {step === "idle" && amount && Number(amount) > 0 && (
          <div
            className="rounded-[14px] px-4 py-3 mb-4 flex justify-between items-center"
            style={{ background: "rgba(0,152,234,0.06)", border: "1px solid rgba(0,152,234,0.15)" }}
          >
            <span className="text-text-secondary text-sm">Estimated yearly yield</span>
            <span className="text-accent font-semibold">+{estimatedYield} {row.symbol}</span>
          </div>
        )}

        {/* CTA area */}
        {step === "idle" && (
          <button
            onClick={handleGetQuote}
            className="w-full py-3.5 rounded-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #0098EA, #007bc4)" }}
          >
            {isConnected ? "Get Quote via Omniston" : "Connect Wallet to Swap"}
          </button>
        )}

        {step === "quoting" && (
          <div
            className="w-full py-3.5 rounded-[14px] text-center text-text-secondary font-medium"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="animate-pulse">Requesting quote from resolvers…</span>
          </div>
        )}

        {step === "quoted" && (
          <div className="flex gap-3">
            <button
              onClick={() => { setStep("idle"); setQuote(null); }}
              className="flex-1 py-3.5 rounded-[14px] font-medium text-text-secondary transition-all hover:text-text-primary"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Refresh
            </button>
            <button
              onClick={handleConfirmSwap}
              className="flex-[2] py-3.5 rounded-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #00C98D, #00a873)" }}
            >
              Confirm Swap
            </button>
          </div>
        )}

        {(step === "building" || step === "sending") && (
          <div
            className="w-full py-3.5 rounded-[14px] text-center font-medium"
            style={{ background: "rgba(0,201,141,0.08)", border: "1px solid rgba(0,201,141,0.2)", color: "#00C98D" }}
          >
            <span className="animate-pulse">
              {step === "building" ? "Building transaction…" : "Waiting for wallet confirmation…"}
            </span>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-3">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-text-primary font-semibold mb-1">Transaction submitted!</p>
            <p className="text-text-secondary text-sm mb-3">
              {formatUnits(inputUnits, decimals)} {row.symbol} is now routing to earn {row.bestApy}% APY
            </p>
            {txHash && (
              <a
                href={`https://tonviewer.com/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm underline hover:opacity-80"
              >
                View on Tonviewer →
              </a>
            )}
          </div>
        )}

        {step === "error" && (
          <div className="space-y-3">
            <div
              className="rounded-[14px] px-4 py-3 text-sm"
              style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff6b6b" }}
            >
              {errorMsg || "An unexpected error occurred."}
            </div>
            <button
              onClick={() => { setStep("idle"); setQuote(null); setErrorMsg(""); }}
              className="w-full py-3 rounded-[14px] font-medium text-text-secondary transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Try again
            </button>
          </div>
        )}

        <p className="text-center text-text-secondary text-xs mt-4">
          Powered by <span className="text-accent">Omniston</span> crosschain SDK · v0.8.x
        </p>
      </div>
    </div>
  );
}
