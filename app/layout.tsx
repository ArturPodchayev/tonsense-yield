import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TonSense Yield — Cross-chain yield comparator",
  description:
    "Find where your crypto earns the most. Swap in one click via Omniston.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Background orbs */}
        <div
          className="bg-orb"
          style={{
            width: 600,
            height: 600,
            top: -200,
            left: -150,
            background: "#0098EA",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: 400,
            height: 400,
            bottom: -100,
            right: -100,
            background: "#00C98D",
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
