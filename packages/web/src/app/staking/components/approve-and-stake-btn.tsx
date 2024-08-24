import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import ETHStakingCollateralAbi from "../../../abis/ETHStakingCollateral";
import { ETH_STAKING_COLLATERAL } from "@/constants";
import { parseEther } from "viem";
import { useEffect, useRef } from "react";

export type ApproveAndStakeBtnProps = {
  onStaked?: () => void;
};

export default function ApproveAndStakeBtn({
  onStaked,
}: ApproveAndStakeBtnProps) {
  const account = useAccount();
  const toastId = useRef<string | undefined>(undefined);
  const { data: balance } = useBalance({
    address: account.address,
  });

  const {
    writeContract: writeL1Contract,
    isPending: isL1Loading,
    data: stakeData,
  } = useWriteContract();

  const isSufficientBalance = balance
    ? parseFloat(balance.formatted) > 0.001
    : false;

  const {
    isLoading: isStakeLoading,
    isSuccess: isStakeSuccess,
    // data: stakeReceipt,
  } = useWaitForTransactionReceipt({
    hash: stakeData,
    chainId: 11155111,
  });

  useEffect(() => {
    if (toastId.current && isStakeSuccess) {
      onStaked?.();

      toast.success("Staked tokens successfully!", { id: toastId.current });
      toastId.current = undefined;
    }
  }, [isStakeSuccess]);

  const handleStake = async () => {
    const ask = confirm("Are you sure you want to stake 0.001 ETH?");
    if (!ask) return;

    toastId.current = toast.loading("Staking 0.001 ETH...");
    try {
      await writeL1Contract({
        abi: ETHStakingCollateralAbi,
        address: ETH_STAKING_COLLATERAL,
        functionName: "stake",
        chainId: 11155111,
        value: parseEther("0.001"),
      });
    } catch (error) {
      toast.error("Error staking tokens", { id: toastId.current });
      toastId.current = undefined;
    }
  };

  return (
    <Button
      className="bg-[#ff684b] border border-[#ff684b] text-[#fff] font-medium py-5 px-6 rounded-lg w-full"
      onClick={handleStake}
      variant="ghost"
      disabled={isL1Loading || !isSufficientBalance}
    >
      Deposit 0.001 ETH Stake
    </Button>
  );
}
