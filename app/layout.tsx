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
            width: 800,
            height: 800,
            top: -300,
            left: -250,
            background: "radial-gradient(circle, #0098EA, transparent 70%)",
            opacity: 0.08,
            filter: "blur(120px)",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: 600,
            height: 600,
            bottom: -200,
            right: -180,
            background: "radial-gradient(circle, #00D4AA, transparent 70%)",
            opacity: 0.06,
            filter: "blur(120px)",
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
