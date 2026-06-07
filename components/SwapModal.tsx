"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { useRfq, useOmniston } from "@ston-fi/omniston-sdk-react";
import type { Quote, AssetId, ChainAddress } from "@ston-fi/omniston-sdk";
import type { ApyRow, SwapConfig } from "@/lib/apyData";

interface SwapModalProps {
  row: ApyRow;
  onClose: () => void;
}

// ─── Protobuf helpers ────────────────────────────────────────────────────────

function toAssetId(asset: SwapConfig["input"]): AssetId {
  if (asset.chain === "ton") {
    if (!asset.contractAddress) {
      return { chain: { $case: "ton", value: { kind: { $case: "native", value: {} } } } };
    }
    return {
      chain: {
        $case: "ton",
        value: { kind: { $case: "jetton", value: asset.contractAddress } },
      },
    };
  }
  const evmCase = asset.chain as "ethereum" | "base" | "bnb";
  return {
    chain: {
      $case: evmCase,
      value: { kind: { $case: "erc20", value: asset.contractAddress! } },
    },
  };
}

function toChainAddress(
  chain: SwapConfig["input"]["chain"],
  address: string
): ChainAddress {
  return { chain: { $case: chain, value: address } };
}

// hex BoC → base64 (TON Connect expects base64)
function hexToBase64(hex: string): string {
  let binary = "";
  for (let i = 0; i < hex.length; i += 2) {
    binary += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  }
  return btoa(binary);
}

// ─── Unit conversion ─────────────────────────────────────────────────────────

function toUnits(amount: string, decimals: number): string {
  const [whole, frac = ""] = (amount || "0").split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return (
    BigInt(whole || "0") * BigInt(10 ** decimals) +
    BigInt(fracPadded || "0")
  ).toString();
}

// Safe: returns "" if raw is empty/undefined/unparseable
function formatUnits(raw: string | undefined, decimals: number): string {
  if (!raw || raw === "0") return "0";
  try {
    const n = BigInt(raw);
    const factor = BigInt(10 ** decimals);
    const whole = n / factor;
    const frac = (n % factor).toString().padStart(decimals, "0").replace(/0+$/, "");
    return frac ? `${whole}.${frac}` : `${whole}`;
  } catch {
    return "?";
  }
}

// ─── Quote field accessors (all optional in protobuf) ─────────────────────────

function safeQuoteId(q: Quote): string {
  return q?.quoteId ?? "";
}
function safeOutputUnits(q: Quote): string {
  return q?.outputUnits ?? "0";
}
function safeInputUnits(q: Quote): string {
  return q?.inputUnits ?? "0";
}
function safeResolverName(q: Quote): string {
  if (q?.resolverName) return q.resolverName;
  if (q?.resolverId) return q.resolverId.slice(0, 14) + "…";
  return "unknown";
}
function safeGasBudget(q: Quote): string | undefined {
  return q?.gasBudget && q.gasBudget !== "0" ? q.gasBudget : undefined;
}

// ─── Type guard for QuoteEvent ────────────────────────────────────────────────

interface SafeQuoteEvent {
  eventCase: string;
  quote?: Quote;
}

// The SDK observable can emit QuoteEvent | UnsubscribeEvent | partial objects.
// Guard everything with optional chaining before touching .$case.
function extractQuoteEvent(raw: unknown): SafeQuoteEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;

  // Handles: { event: { $case: "quoteUpdated", value: Quote } }
  const eventField = data["event"] as Record<string, unknown> | undefined;
  if (!eventField || typeof eventField !== "object") return null;

  const eventCase = eventField["$case"];
  if (typeof eventCase !== "string") return null;

  if (eventCase === "quoteUpdated") {
    const quote = eventField["value"] as Quote | undefined;
    return { eventCase, quote };
  }
  return { eventCase };
}

// ─── Component ───────────────────────────────────────────────────────────────

type Step = "idle" | "quoting" | "quoted" | "building" | "sending" | "done" | "error";

const EVM_PLACEHOLDER: Record<string, string> = {
  ethereum: "0xYourEthereumAddress",
  base: "0xYourBaseAddress",
  bnb: "0xYourBNBAddress",
};

export function SwapModal({ row, onClose }: SwapModalProps) {
  const { swap } = row;
  const [amount, setAmount] = useState("10");
  const [dstAddress, setDstAddress] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [txBoc, setTxBoc] = useState("");

  const [tonConnectUI] = useTonConnectUI();
  const userTonAddress = useTonAddress();
  const omniston = useOmniston();

  const isConnected = Boolean(userTonAddress);
  const isValidDst = !swap.crosschain || dstAddress.startsWith("0x");

  const inputUnits = (() => {
    try {
      return toUnits(amount || "0", swap.input.decimals);
    } catch {
      return "0";
    }
  })();

  const rfqRequest = {
    inputAsset: toAssetId(swap.input),
    outputAsset: toAssetId(swap.output),
    amount: { $case: "inputUnits" as const, value: inputUnits },
    settlementParams: swap.crosschain
      ? [{ params: { $case: "order" as const, value: {} } }]
      : [
          {
            params: {
              $case: "swap" as const,
              value: { maxPriceSlippagePips: 10_000, flexibleIntegratorFee: true },
            },
          },
        ],
  };

  const rfq = useRfq(rfqRequest, { enabled: step === "quoting" });

  // 15-second timeout — if still quoting, surface a readable error
  useEffect(() => {
    if (step !== "quoting") return;
    const timer = setTimeout(() => {
      // functional update avoids stale closure: only fires if still quoting
      setStep((current) => {
        if (current === "quoting") {
          setErrorMsg(
            "No quote received after 15 seconds. Resolvers may not support this pair right now — try a different amount."
          );
          return "error";
        }
        return current;
      });
    }, 15_000);
    return () => clearTimeout(timer);
  }, [step]);

  // Watch the RFQ observable stream — guard every field access
  useEffect(() => {
    if (step !== "quoting") return;

    // WebSocket or parsing failure
    if (rfq.isError) {
      setErrorMsg("Failed to connect to Omniston. Check your network and try again.");
      setStep("error");
      return;
    }

    if (!rfq.data) return;

    try {
      const parsed = extractQuoteEvent(rfq.data);
      if (!parsed) return;

      if (parsed.eventCase === "quoteUpdated") {
        if (!parsed.quote) {
          setErrorMsg("Received an empty quote from resolver.");
          setStep("error");
          return;
        }
        setQuote(parsed.quote);
        setStep("quoted");
      } else if (parsed.eventCase === "noQuote") {
        setErrorMsg(
          "No resolver responded to this pair. Try a smaller amount or check back later."
        );
        setStep("error");
      }
      // "ack" and "keepAlive" are informational — stay in quoting state
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Quote parsing error: ${msg}`);
      setStep("error");
    }
  }, [rfq.data, rfq.isError, step]);

  function reset() {
    setStep("idle");
    setQuote(null);
    setErrorMsg("");
    setTxBoc("");
  }

  async function handleGetQuote() {
    if (!isConnected) {
      tonConnectUI.openModal();
      return;
    }
    if (!isValidDst) return;
    reset();
    setStep("quoting");
  }

  async function handleConfirmSwap() {
    if (!quote || !userTonAddress) return;
    const qid = safeQuoteId(quote);
    if (!qid) {
      setErrorMsg("Quote ID is missing — please refresh the quote.");
      setStep("error");
      return;
    }

    setStep("building");
    try {
      const tonTx = swap.crosschain
        ? await omniston.tonBuildEscrowTransfer({
            quoteId: qid,
            ownerSrcAddress: toChainAddress("ton", userTonAddress),
            traderDstAddress: toChainAddress(swap.output.chain, dstAddress),
          })
        : await omniston.tonBuildSwap({
            quoteId: qid,
            transferSrcAddress: toChainAddress("ton", userTonAddress),
            useRecommendedSlippage: true,
          });

      if (!tonTx?.messages?.length) {
        throw new Error("Omniston returned an empty transaction — no messages to send.");
      }

      setStep("sending");

      const messages = tonTx.messages.map((msg) => ({
        address: msg.targetAddress,
        amount: msg.sendAmount,
        ...(msg.payload ? { payload: hexToBase64(msg.payload) } : {}),
        ...(msg.jettonWalletStateInit
          ? { stateInit: hexToBase64(msg.jettonWalletStateInit) }
          : {}),
      }));

      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages,
      });

      setTxBoc(result.boc ?? "");
      setStep("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(
        msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("cancel")
          ? "Transaction cancelled in wallet."
          : msg
      );
      setStep("error");
    }
  }

  const inDec = swap.input.decimals;
  const outDec = swap.output.decimals;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,8,16,0.88)", backdropFilter: "blur(8px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]"
        style={{ boxShadow: "0 0 60px rgba(0,152,234,0.14)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          ×
        </button>

        <h2 className="text-lg font-semibold text-text-primary mb-1">
          {swap.crosschain ? "Crosschain Swap" : "Swap via Omniston"}
        </h2>
        <p className="text-text-secondary text-sm mb-5">
          {swap.crosschain
            ? `Bridge ${swap.input.label} → ${swap.output.label} via Omniston ORDER settlement`
            : `Swap ${swap.input.label} → ${swap.output.label} via Omniston SWAP`}
        </p>

        {/* From */}
        <label className="text-xs text-text-secondary mb-1.5 block">You send</label>
        <div
          className="flex items-center gap-3 rounded-[14px] px-4 py-3 mb-3"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span className="text-xl">{row.icon}</span>
          <div className="flex-1">
            <div className="text-text-secondary text-xs">
              {swap.input.chain.toUpperCase()}
            </div>
            <div className="text-text-primary font-medium">{swap.input.label}</div>
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              reset();
            }}
            disabled={step !== "idle" && step !== "error"}
            className="bg-transparent text-right text-text-primary font-medium w-24 outline-none disabled:opacity-60"
            min="0"
            step="1"
          />
        </div>

        <div className="flex justify-center items-center my-2 gap-2 text-text-secondary text-sm">
          <span>↓</span>
          {swap.crosschain && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(0,152,234,0.12)",
                color: "#0098EA",
                border: "1px solid rgba(0,152,234,0.25)",
              }}
            >
              crosschain
            </span>
          )}
        </div>

        {/* To */}
        <label className="text-xs text-text-secondary mb-1.5 block">You receive</label>
        <div
          className="flex items-center gap-3 rounded-[14px] px-4 py-3 mb-4"
          style={{
            background: "rgba(0,201,141,0.06)",
            border: "1px solid rgba(0,201,141,0.2)",
          }}
        >
          <span className="text-xl">💵</span>
          <div className="flex-1">
            <div className="text-text-secondary text-xs">
              {swap.output.chain.toUpperCase()}
            </div>
            <div className="text-text-primary font-medium">{swap.output.label}</div>
          </div>
          {quote ? (
            <div className="text-right">
              <div style={{ color: "#00C98D" }} className="font-semibold">
                ~{formatUnits(safeOutputUnits(quote), outDec)}
              </div>
              <div className="text-text-secondary text-xs">{row.symbol}</div>
            </div>
          ) : (
            <div className="text-right text-text-secondary text-xs">
              awaiting quote
            </div>
          )}
        </div>

        {/* EVM destination address — crosschain only */}
        {swap.crosschain && (
          <div className="mb-4">
            <label className="text-xs text-text-secondary mb-1.5 block">
              Your {swap.output.chain} address (receives funds)
            </label>
            <input
              type="text"
              value={dstAddress}
              onChange={(e) => setDstAddress(e.target.value.trim())}
              disabled={step !== "idle" && step !== "error"}
              placeholder={EVM_PLACEHOLDER[swap.output.chain] ?? "0x…"}
              className="w-full rounded-[12px] px-4 py-2.5 text-sm text-text-primary outline-none disabled:opacity-60 font-mono"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  dstAddress && !dstAddress.startsWith("0x")
                    ? "rgba(255,80,80,0.4)"
                    : "rgba(255,255,255,0.1)"
                }`,
              }}
            />
            {dstAddress && !dstAddress.startsWith("0x") && (
              <p className="text-xs mt-1" style={{ color: "#ff6b6b" }}>
                Must be a valid 0x… EVM address
              </p>
            )}
          </div>
        )}

        {/* Quote details */}
        {quote && step === "quoted" && (
          <div
            className="rounded-[14px] px-4 py-3 mb-4 space-y-1.5 text-sm"
            style={{
              background: "rgba(0,152,234,0.06)",
              border: "1px solid rgba(0,152,234,0.15)",
            }}
          >
            <div className="flex justify-between">
              <span className="text-text-secondary">Input</span>
              <span className="text-text-primary">
                {formatUnits(safeInputUnits(quote), inDec)} {row.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Output</span>
              <span className="text-text-primary">
                {formatUnits(safeOutputUnits(quote), outDec)} {row.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Resolver</span>
              <span className="text-accent">{safeResolverName(quote)}</span>
            </div>
            {safeGasBudget(quote) && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Gas (TON)</span>
                <span className="text-text-primary">
                  {formatUnits(safeGasBudget(quote), 9)} TON
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-secondary">Settlement</span>
              <span className="text-accent text-xs">
                {swap.crosschain ? "Omniston ORDER (HTLC)" : "Omniston SWAP"} ✓
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        {step === "idle" && (
          <button
            onClick={handleGetQuote}
            disabled={swap.crosschain && !isValidDst}
            className="w-full py-3.5 rounded-[14px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #0098EA, #007bc4)" }}
          >
            {!isConnected
              ? "Connect TON Wallet"
              : swap.crosschain && !isValidDst
              ? "Enter destination address"
              : "Get Quote via Omniston"}
          </button>
        )}

        {step === "quoting" && (
          <div
            className="w-full py-3.5 rounded-[14px] text-center text-text-secondary font-medium"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="animate-pulse">Requesting quote from resolvers…</span>
          </div>
        )}

        {step === "quoted" && (
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 py-3.5 rounded-[14px] font-medium text-text-secondary hover:text-text-primary transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
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
            style={{
              background: "rgba(0,201,141,0.08)",
              border: "1px solid rgba(0,201,141,0.2)",
              color: "#00C98D",
            }}
          >
            <span className="animate-pulse">
              {step === "building"
                ? "Building transaction…"
                : "Waiting for wallet approval…"}
            </span>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-3">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-text-primary font-semibold mb-1">Transaction submitted!</p>
            <p className="text-text-secondary text-sm mb-3">
              Resolver will fill your order on{" "}
              <span className="text-text-primary">{swap.output.chain}</span>
            </p>
            {txBoc && (
              <p className="text-text-secondary text-xs font-mono break-all mb-2">
                BoC: {txBoc.slice(0, 40)}…
              </p>
            )}
            <p className="text-text-secondary text-xs">
              Check Tonviewer for the on-chain tx
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-3">
            <div
              className="rounded-[14px] px-4 py-3 text-sm"
              style={{
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.2)",
                color: "#ff6b6b",
              }}
            >
              {errorMsg || "An unexpected error occurred."}
            </div>
            <button
              onClick={reset}
              className="w-full py-3 rounded-[14px] font-medium text-text-secondary hover:text-text-primary transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Try again
            </button>
          </div>
        )}

        <p className="text-center text-text-secondary text-xs mt-4">
          Powered by <span className="text-accent">Omniston</span> ·{" "}
          {swap.crosschain ? "HTLC ORDER settlement" : "atomic SWAP"}
        </p>
      </div>
    </div>
  );
}
