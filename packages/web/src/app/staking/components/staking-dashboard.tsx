"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount, useReadContract } from "wagmi";
import ETHStakingCollateralAbi from "../../abis/ETHStakingCollateral";
import L2BorroweAbi from "../../abis/L2Borrow";
import { ETH_STAKING_COLLATERAL, L2_BORROW_COLLATERAL } from "@/constants";
import { formatEther } from "viem";
import ApproveBorrowBtn from "./approve-and-borrow-btn";
import ApproveAndRepayBtn from "./approve-and-repay-btn";
import SwitchNetworkProvider from "./switch-network-provider";
import ApproveAndStakeBtn from "./approve-and-stake-btn";

export default function StakingDashboard() {
  const account = useAccount();

  const {
    data: stakedBalance,
    isLoading: isStakedBalanceLoading,
    refetch: refetchStakedBalance,
    isRefetching: isStakedBalanceRefetching,
  } = useReadContract({
    abi: ETHStakingCollateralAbi,
    address: ETH_STAKING_COLLATERAL,
    chainId: 11155111,
    functionName: "getStakedBalance",
    account: account.address,
  });

  const {
    data: availableBalance,
    isLoading: isAvailableBalanceLoading,
    refetch: refetchAvailableBalance,
    isRefetching: isAvailableBalanceRefetching,
  } = useReadContract({
    abi: L2BorroweAbi,
    address: L2_BORROW_COLLATERAL,
    functionName: "getMaxBorrowAmount",
    chainId: 2227728,
    args: [account.address!],
  });

  const {
    data: borrorwedBalance,
    isLoading: isBorrowedBalanceLoading,
    isRefetching: isBorrowedBalanceRefetching,
    refetch: refetchBorrowedBalance,
  } = useReadContract({
    abi: L2BorroweAbi,
    address: L2_BORROW_COLLATERAL,
    functionName: "getBorrowedBalance",
    chainId: 2227728,
    args: [account.address!],
  });

  return (
    <div className="min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold mb-6">My Tokens</h1>
      <Card className="bg-purple-900 rounded-lg shadow-lg">
        <CardContent className="grid grid-cols-4 gap-6 p-6">
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">ETH Staked on Ethereum</h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              {isStakedBalanceRefetching || isStakedBalanceLoading ? (
                <div className="w-16 h-8 bg-gray-100 animate-pulse"></div>
              ) : (
                <span className="text-4xl text-white font-bold">
                  {formatEther(stakedBalance ?? BigInt(0))}
                </span>
              )}
            </div>
            <SwitchNetworkProvider
              toChainId={11155111}
              networkName="Ethereum Sepolia"
            >
              <ApproveAndStakeBtn onStaked={() => refetchStakedBalance()} />
            </SwitchNetworkProvider>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">Liquidation LTV</h2>
            <div className="flex items-center">
              <div className="text-white text-3xl">100%</div>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">
              Borrowable Amount (Scroll)
            </h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>

              {isAvailableBalanceRefetching || isAvailableBalanceLoading ? (
                <div className="w-16 h-8 bg-gray-100 animate-pulse"></div>
              ) : (
                <span className="text-4xl text-white font-bold">
                  {formatEther(availableBalance ?? BigInt(0))}
                </span>
              )}
            </div>
            <SwitchNetworkProvider
              toChainId={2227728}
              networkName="Scroll Sepolia"
            >
              <ApproveBorrowBtn
                onBorrow={() => {
                  refetchAvailableBalance();
                  refetchBorrowedBalance();
                }}
              />
            </SwitchNetworkProvider>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">Repayment (Scroll)</h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>

              {isBorrowedBalanceRefetching || isBorrowedBalanceLoading ? (
                <div className="w-16 h-8 bg-gray-100 animate-pulse"></div>
              ) : (
                <span className="text-4xl text-white font-bold">
                  {formatEther(borrorwedBalance ?? BigInt(0))}
                </span>
              )}
            </div>
            <SwitchNetworkProvider
              toChainId={2227728}
              networkName="Scroll Sepolia"
            >
              <ApproveAndRepayBtn
                borrorwedBalance={borrorwedBalance}
                onRepay={() => refetchBorrowedBalance()}
              />
            </SwitchNetworkProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
