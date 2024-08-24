import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Providers from "@/components/providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "L1sload Oracle",
  description: "Layer 1 blockchain data oracle and token staking platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-[#fff8f3]")}>
        <Providers>
          <nav className="p-4 flex items-center">
            <ul className="flex space-x-4 flex-1">
              {/* <li>
                <Link href="/" className="text-[#101010] hover:text-gray-300">
                  Home
                </Link>
              </li> */}
              <li>
                <Link
                  href="/staking"
                  className="text-[#101010] text-lg hover:bg-[#fff0dd] p-3"
                >
                  Staking
                </Link>
              </li>
            </ul>
            <ConnectButton />
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
