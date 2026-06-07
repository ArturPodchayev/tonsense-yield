export interface ChainAsset {
  chain: "ton" | "ethereum" | "base" | "bnb";
  label: string;
  contractAddress?: string; // undefined = native
  decimals: number;
}

export interface SwapConfig {
  /** Asset the user sends (from their TON wallet) */
  input: ChainAsset;
  /** Asset they receive on the destination chain */
  output: ChainAsset;
  /** Whether this requires ORDER (crosschain HTLC) vs SWAP (intrachain) */
  crosschain: boolean;
}

export interface StakingInfo {
  protocol: string;
  url: string;
  receivedAsset: string;
  description: string;
}

export interface SecurityFinding {
  severity: "info" | "low" | "medium" | "high";
  description: string;
}

export interface SecurityInfo {
  riskLevel: "Low" | "Medium" | "High";
  auditedBy: string[];
  contractAddress?: string;
  findings: SecurityFinding[];
  summary: string;
}

export interface ApyRow {
  asset: string;
  symbol: string;
  icon: string;
  tonApy: number | null;
  ethApy: number | null;
  baseApy: number | null;
  bnbApy: number | null;
  bestChain: string;
  bestApy: number;
  swap?: SwapConfig;
  stakingInfo?: StakingInfo;
  securityInfo?: SecurityInfo;
}

export const APY_DATA: ApyRow[] = [
  {
    asset: "Toncoin",
    symbol: "TON",
    icon: "💎",
    tonApy: 5.2,
    ethApy: null,
    baseApy: null,
    bnbApy: null,
    bestChain: "TON",
    bestApy: 5.2,
    // TON staking via Tonstakers — no Omniston swap (Omniston only does stablecoin crosschain)
    stakingInfo: {
      protocol: "Tonstakers",
      url: "https://tonstakers.com",
      receivedAsset: "tsTON",
      description: "Liquid staking on TON. Stake TON, receive tsTON — a yield-bearing token that accrues 5.2% APY. No lockup, unstake anytime.",
    },
    securityInfo: {
      riskLevel: "Low",
      auditedBy: ["CertiK", "Quantstamp"],
      contractAddress: "EQC98_qAmNEptUtPc7W6xdHh_ZHrBUFpw5Ft_IzBovkMstico",
      summary: "Tonstakers is the leading liquid staking protocol on TON with over $180M TVL. Contracts are open-source, audited, and have operated without incidents since 2022.",
      findings: [
        { severity: "info", description: "Open-source contracts — publicly verifiable on GitHub and TON Explorer" },
        { severity: "info", description: "Live since 2022 with no exploits or loss of funds" },
        { severity: "info", description: "tsTON is redeemable 1:1 for TON — no peg risk" },
        { severity: "low", description: "Contract upgrades are gated by a 3-of-5 multisig — low centralisation risk" },
        { severity: "low", description: "Validator slashing is socialised across pool — individual exposure is minimal" },
      ],
    },
  },
  {
    asset: "Tether USD",
    symbol: "USDT",
    icon: "₮",
    tonApy: 4.1,
    ethApy: 2.8,
    baseApy: 3.5,
    bnbApy: 3.2,
    bestChain: "TON",
    bestApy: 4.1,
    // USDT on TON → TON native (intrachain SWAP via Omniston — verified working pair)
    swap: {
      input: {
        chain: "ton",
        label: "USDT on TON",
        contractAddress: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        decimals: 6,
      },
      output: {
        chain: "ton",
        label: "TON (native)",
        contractAddress: undefined,
        decimals: 9,
      },
      crosschain: false,
    },
    securityInfo: {
      riskLevel: "Low",
      auditedBy: ["Trail of Bits", "STON.fi Security Team"],
      contractAddress: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
      summary: "USDT on TON is issued by Tether and swapped via the STON.fi DEX — the largest AMM on TON with over $400M in liquidity. The swap route is intrachain and battle-tested.",
      findings: [
        { severity: "info", description: "STON.fi router contracts audited by Trail of Bits — report published publicly" },
        { severity: "info", description: "USDT is the largest stablecoin globally — backed 1:1 by USD reserves" },
        { severity: "info", description: "Intrachain swap — no bridge or cross-chain counterparty risk" },
        { severity: "low", description: "STON.fi contracts support admin upgrades via a timelock — standard practice" },
        { severity: "medium", description: "Tether (USDT) is a centralised issuer — freeze and blacklist functions exist on the token contract" },
      ],
    },
  },
  {
    asset: "USD Coin",
    symbol: "USDC",
    icon: "$",
    tonApy: 4.0,
    ethApy: 2.9,
    baseApy: 3.6,
    bnbApy: 3.1,
    bestChain: "TON",
    bestApy: 4.0,
    // USDC on TON → USDC on Base (real crosschain via Omniston ORDER)
    swap: {
      input: {
        chain: "ton",
        label: "USDC on TON",
        contractAddress: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728",
        decimals: 6,
      },
      output: {
        chain: "base",
        label: "USDC on Base",
        contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        decimals: 6,
      },
      crosschain: true,
    },
    securityInfo: {
      riskLevel: "Medium",
      auditedBy: ["Omniston Security Team"],
      contractAddress: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728",
      summary: "USDC crosschain swap uses Omniston's HTLC-based escrow protocol between TON and Base. While atomic in design, cross-chain swaps carry additional risk compared to intrachain operations.",
      findings: [
        { severity: "info", description: "USDC issued by Circle — fully audited, regulated, and redeemable 1:1 for USD" },
        { severity: "info", description: "Omniston uses HTLC (Hash Time-Lock Contract) escrow — atomic swap, no custodian" },
        { severity: "low", description: "Resolver network is permissioned — only approved resolvers can fill orders" },
        { severity: "medium", description: "Cross-chain bridge adds latency and additional failure modes vs intrachain swaps" },
        { severity: "medium", description: "Omniston protocol is relatively new (launched 2024) — less battle-tested than established bridges" },
      ],
    },
  },
];

export type ChainKey = "tonApy" | "ethApy" | "baseApy" | "bnbApy";

export const CHAIN_LABELS: Record<ChainKey, string> = {
  tonApy: "TON",
  ethApy: "Ethereum",
  baseApy: "Base",
  bnbApy: "BNB",
};
