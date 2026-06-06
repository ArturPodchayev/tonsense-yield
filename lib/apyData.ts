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
  swap: SwapConfig;
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
    // TON→USDT intrachain swap (demonstrating Omniston on TON)
    swap: {
      input: {
        chain: "ton",
        label: "TON (native)",
        contractAddress: undefined,
        decimals: 9,
      },
      output: {
        chain: "ton",
        label: "USDT on TON",
        contractAddress: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        decimals: 6,
      },
      crosschain: false,
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
    // USDT on TON → USDT on Ethereum (real crosschain via Omniston ORDER)
    swap: {
      input: {
        chain: "ton",
        label: "USDT on TON",
        contractAddress: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        decimals: 6,
      },
      output: {
        chain: "ethereum",
        label: "USDT on Ethereum",
        contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: 6,
      },
      crosschain: true,
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
  },
];

export type ChainKey = "tonApy" | "ethApy" | "baseApy" | "bnbApy";

export const CHAIN_LABELS: Record<ChainKey, string> = {
  tonApy: "TON",
  ethApy: "Ethereum",
  baseApy: "Base",
  bnbApy: "BNB",
};
