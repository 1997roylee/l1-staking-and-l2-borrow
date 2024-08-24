"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useReadContract,
  useToken,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import ETHStakingCollateralAbi from "../../abis/ETHStakingCollateral";
import L2BorroweAbi from "../../abis/L2Borrow";
import {
  ETH_STAKING_COLLATERAL,
  L2_BORROW_COLLATERAL,
  MOCK_ERC_20,
} from "@/constants";
import { erc20Abi, formatEther, getContract, parseEther } from "viem";
import toast from "react-hot-toast";

interface TokenData {
  available: number;
  staked: number;
  rewards: number;
}

export default function StakingDashboard() {
  const account = useAccount();
  // const publicClient = usePublicClient();
  // const { data: walletClient } = useWalletClient();
  const {
    data: stakedBalance,
    isLoading: isStakedBalanceLoading,
    refetch: refetchStakedBalance,
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
  } = useReadContract({
    abi: L2BorroweAbi,
    address: L2_BORROW_COLLATERAL,
    functionName: "getMaxBorrowAmount",
    chainId: 2227728,
    args: [account.address!],
  });

  const { writeContract: writeL1Contract, isPending: isL1Loading } =
    useWriteContract();
  const { writeContract: writeL2Contract, isPending: isL2Loading } =
    useWriteContract();

  const { data: balance } = useBalance({
    address: account.address,
  });
  const handleStake = async () => {
    const ask = confirm("Are you sure you want to stake 0.001 ETH?");
    if (!ask) return;

    const toastId = toast.loading("Staking tokens...");
    try {
      await writeL1Contract({
        abi: ETHStakingCollateralAbi,
        address: ETH_STAKING_COLLATERAL,
        functionName: "stake",
        chainId: 11155111,
        value: parseEther("0.001"),
      });
      refetchStakedBalance();
      toast.success("Staked tokens successfully!", { id: toastId });
    } catch (error) {
      toast.error("Error staking tokens", { id: toastId });
    }
  };

  const isSufficientBalance = balance
    ? parseFloat(balance.formatted) > 0.001
    : false;

  const handleBorrow = async () => {
    const ask = confirm("Are you sure you want to borrow 0.001 ETH?");
    if (!ask) return;

    const toastId = toast.loading("Borrowing tokens...");

    try {
      await writeL2Contract({
        abi: erc20Abi,
        address: MOCK_ERC_20,
        functionName: "approve",
        chainId: 2227728,
        args: [account.address!, parseEther("0.001")],
        account: account.address,
      });
      // await writeL2Contract({
      //   abi: L2BorroweAbi,
      //   address: L2_BORROW_COLLATERAL,
      //   functionName: "borrow",
      //   chainId: 2227728,
      //   args: [parseEther("0.001")],
      //   account: account.address,
      // });
      // refetchAvailableBalance();
      toast.success("Borrowed tokens successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Error borrowing tokens", { id: toastId });
    }
  };

  console.log("balance", balance, availableBalance);
  return (
    <div className="min-h-screen bg-purple-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-6">My Tokens</h1>
      <Card className="bg-purple-900 rounded-lg shadow-lg">
        <CardContent className="flex items-stretch p-6">
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">
              Staked ETH (ETH Network)
            </h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-4xl text-white font-bold">
                {formatEther(stakedBalance ?? BigInt(0))}
              </span>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-full"
              onClick={handleStake}
              disabled={isL1Loading || !isSufficientBalance}
            >
              STAKE TOKENS
            </Button>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">Liquidation LTV</h2>
            <div className="flex items-center">
              <div className="text-white text-3xl">100%</div>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 px-4">
            <h2 className="text-lg text-white mb-2">Borrow (Scroll Network)</h2>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-50 rounded-full mr-3 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <span className="text-4xl text-white font-bold">
                {formatEther(availableBalance ?? BigInt(0))}
              </span>
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded w-full"
              onClick={handleBorrow}
            >
              Borrow
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
