import { NextResponse } from "next/server";

export async function GET() {
  // Replace this with actual API call to fetch crypto data
  const l1Data = [
    { id: 1, name: "Bitcoin", symbol: "BTC", price: 63967.0 },
    { id: 2, name: "Ethereum", symbol: "ETH", price: 2757.73 },
    { id: 3, name: "Tether", symbol: "USDT", price: 1.0 },
    { id: 4, name: "BNB", symbol: "BNB", price: 587.48 },
    { id: 5, name: "Solana", symbol: "SOL", price: 153.61 },
    { id: 6, name: "USD Coin", symbol: "USDC", price: 1.0 },
    { id: 7, name: "XRP", symbol: "XRP", price: 0.6079 },
    { id: 8, name: "Toncoin", symbol: "TON", price: 6.75 },
    { id: 9, name: "Dogecoin", symbol: "DOGE", price: 0.1125 },
  ];

  return NextResponse.json(l1Data);
}
