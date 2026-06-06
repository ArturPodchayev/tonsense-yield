"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { OmnistonProvider, Omniston } from "@ston-fi/omniston-sdk-react";

const omniston = new Omniston({
  apiUrl: "wss://omni-ws.ston.fi",
});

const MANIFEST_URL =
  process.env.NEXT_PUBLIC_TON_CONNECT_MANIFEST ||
  "https://tonsense-yield.vercel.app/tonconnect-manifest.json";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <OmnistonProvider omniston={omniston}>{children}</OmnistonProvider>
    </TonConnectUIProvider>
  );
}
