'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TokenData {
  available: number;
  staked: number;
  rewards: number;
}

export default function TokenStakingDashboard() {
  const [tokenData, setTokenData] = useState<TokenData>({
    available: 0.00,
    staked: 0.00,
    rewards: 0.00,
  });

  return (
    <div className="min-h-screen bg-purple-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">My Tokens</h1>
      <Card className="bg-purple-900 rounded-lg shadow-lg">
        <CardContent className="flex justify-between items-stretch p-6">
          <div className="flex flex-col items-center justify-between flex-1 px-4">
            <h2 className="text-lg text-white mb-2">Available Tokens</h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-4xl text-white font-bold">{tokenData.available.toFixed(2)}</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full">
              STAKE TOKENS
            </Button>
          </div>
          <div className="flex flex-col items-center justify-between flex-1 px-4 border-l border-r border-purple-800">
            <h2 className="text-lg text-white mb-2">Staked Tokens</h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <span className="text-4xl text-white font-bold">{tokenData.staked.toFixed(2)}</span>
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded w-full">
              Unstake
            </Button>
          </div>
          <div className="flex flex-col items-center justify-between flex-1 px-4">
            <h2 className="text-lg text-white mb-2">Rewards</h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <span className="text-4xl text-white font-bold">{tokenData.rewards.toFixed(2)}</span>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded w-full opacity-50 cursor-not-allowed">
              CLAIM
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}