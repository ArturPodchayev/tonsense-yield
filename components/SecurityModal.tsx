"use client";

import type { ApyRow, SecurityInfo, SecurityFinding } from "@/lib/apyData";

interface SecurityModalProps {
  row: ApyRow & { securityInfo: SecurityInfo };
  onClose: () => void;
}

const SEVERITY_CONFIG = {
  info:   { label: "Info",   bg: "rgba(0,152,234,0.12)",  border: "rgba(0,152,234,0.3)",  color: "#0098EA",  dot: "#0098EA"  },
  low:    { label: "Low",    bg: "rgba(0,201,141,0.10)",  border: "rgba(0,201,141,0.3)",  color: "#00C98D",  dot: "#00C98D"  },
  medium: { label: "Medium", bg: "rgba(255,170,0,0.10)",  border: "rgba(255,170,0,0.3)",  color: "#FFAA00",  dot: "#FFAA00"  },
  high:   { label: "High",   bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.3)",  color: "#EF4444",  dot: "#EF4444"  },
};

const RISK_CONFIG = {
  Low:    { bg: "rgba(0,201,141,0.12)",  border: "rgba(0,201,141,0.4)",  color: "#00C98D", glow: "rgba(0,201,141,0.2)"  },
  Medium: { bg: "rgba(255,170,0,0.12)",  border: "rgba(255,170,0,0.4)",  color: "#FFAA00", glow: "rgba(255,170,0,0.2)"  },
  High:   { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.4)",  color: "#EF4444", glow: "rgba(239,68,68,0.2)"  },
};

function FindingRow({ finding }: { finding: SecurityFinding }) {
  const cfg = SEVERITY_CONFIG[finding.severity];
  return (
    <div
      className="flex items-start gap-3 rounded-[10px] px-3 py-2.5"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="inline-flex items-center gap-1 shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded-full mt-0.5"
        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
      >
        <span className="w-1 h-1 rounded-full inline-block" style={{ background: cfg.dot }} />
        {cfg.label}
      </span>
      <span className="text-text-secondary text-sm leading-snug">{finding.description}</span>
    </div>
  );
}

export function SecurityModal({ row, onClose }: SecurityModalProps) {
  const { securityInfo } = row;
  const riskCfg = RISK_CONFIG[securityInfo.riskLevel];
  const shortAddr = securityInfo.contractAddress
    ? `${securityInfo.contractAddress.slice(0, 8)}…${securityInfo.contractAddress.slice(-6)}`
    : null;

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        background: "rgba(8,8,16,0.95)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-card w-full max-w-md p-6 relative overflow-y-auto"
        style={{ boxShadow: "0 0 60px rgba(0,152,234,0.14)", zIndex: 10000, maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors text-xl leading-none"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{row.icon}</span>
          <h2 className="text-lg font-semibold text-text-primary">Security Report</h2>
        </div>
        <div className="mb-5">
          <span
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "rgba(0,152,234,0.12)",
              border: "1px solid rgba(0,152,234,0.25)",
              color: "#0098EA",
            }}
          >
            🛡️ {row.symbol} · {row.asset}
          </span>
        </div>

        {/* Risk score */}
        <div
          className="flex items-center justify-between rounded-[14px] px-5 py-4 mb-5"
          style={{
            background: riskCfg.bg,
            border: `1px solid ${riskCfg.border}`,
            boxShadow: `0 0 20px ${riskCfg.glow}`,
          }}
        >
          <div>
            <div className="text-text-secondary text-xs mb-0.5">Overall Risk</div>
            <div className="text-2xl font-bold" style={{ color: riskCfg.color }}>
              {securityInfo.riskLevel}
            </div>
          </div>
          <div className="text-5xl opacity-80">🛡️</div>
        </div>

        {/* Summary */}
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{securityInfo.summary}</p>

        {/* Audits & contract */}
        <div
          className="rounded-[14px] px-4 py-3 mb-5 space-y-2 text-sm"
          style={{
            background: "rgba(0,152,234,0.06)",
            border: "1px solid rgba(0,152,234,0.15)",
          }}
        >
          {securityInfo.auditedBy.length > 0 && (
            <div className="flex justify-between items-start gap-2">
              <span className="text-text-secondary shrink-0">Audited by</span>
              <span className="text-text-primary text-right">{securityInfo.auditedBy.join(", ")}</span>
            </div>
          )}
          {shortAddr && (
            <div className="flex justify-between items-center gap-2">
              <span className="text-text-secondary shrink-0">Contract</span>
              <span
                className="font-mono text-xs text-text-primary px-2 py-0.5 rounded-md"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {shortAddr}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-secondary">Source</span>
            <span className="text-text-primary">Static analysis · MVP</span>
          </div>
        </div>

        {/* Findings */}
        <div className="mb-5">
          <div className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-2">
            Key Findings
          </div>
          <div className="space-y-2">
            {securityInfo.findings.map((f, i) => (
              <FindingRow key={i} finding={f} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-text-secondary text-xs text-center leading-relaxed">
          This assessment is for informational purposes only. Always DYOR before depositing funds.{" "}
          <span className="text-accent">Tonsec</span> live API coming soon.
        </p>
      </div>
    </div>
  );
}
