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
  contractAddress?: string;
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
    contractAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
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
    contractAddress: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
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
    contractAddress: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728",
  },
];

export type ChainKey = "tonApy" | "ethApy" | "baseApy" | "bnbApy";

export const CHAIN_LABELS: Record<ChainKey, string> = {
  tonApy: "TON",
  ethApy: "Ethereum",
  baseApy: "Base",
  bnbApy: "BNB",
};
