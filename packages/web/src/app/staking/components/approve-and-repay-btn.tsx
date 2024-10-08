import { Button } from "@/components/ui/button";
import { L2_BORROW_COLLATERAL, MOCK_ERC_20 } from "@/constants";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useBalance,
  useAccount,
  useReadContract,
} from "wagmi";
import L2BorroweAbi from "../../../abis/L2Borrow";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { erc20Abi, formatEther, parseEther } from "viem";
import { useTokenApproval } from "@/hooks/use-approve";

export type ApproveAndRepayBtnProps = {
  onRepay?: () => void;
  borrorwedBalance?: BigInt;
};

export default function ApproveAndRepayBtn({
  onRepay,
  borrorwedBalance,
}: ApproveAndRepayBtnProps) {
  const toastId = useRef<string | undefined>(undefined);

  const account = useAccount();

  const { data: balance } = useBalance({
    address: account.address,
    token: MOCK_ERC_20,
  });

  const toRepayBalance =
    balance?.value && Number(balance?.value) > Number(borrorwedBalance)
      ? (borrorwedBalance as bigint)
      : balance?.value;

  const { handleApprove, allowance, isAllowanceLoading, isAllowanceFetching } =
    useTokenApproval(toRepayBalance ?? BigInt(0));
  const {
    writeContract,
    data: repayData,
    // isPending: isRepayLoading,
  } = useWriteContract();
  // const {
  //   writeContract: approveContract,
  //   data: approveData,
  //   // isPending: isApproveLoading,
  // } = useWriteContract();

  const {
    isLoading: isRepayLoading,
    isSuccess: isRepaySuccess,
    data: repayReceipt,
    error: repayError,
  } = useWaitForTransactionReceipt({
    hash: repayData,
    chainId: 2227728,
  });

  // const {
  //   isLoading: isApproveLoading,
  //   isSuccess: isApproveSuccess,
  //   data: approveReceipt,
  //   error: approveError,
  // } = useWaitForTransactionReceipt({
  //   hash: approveData,
  //   chainId: 2227728,
  // });

  // const {
  //   data: allowance,
  //   refetch: refetchAllowance,
  //   isLoading: isAllowanceLoading,
  //   isFetching: isAllowanceFetching,
  // } = useReadContract({
  //   abi: erc20Abi,
  //   address: MOCK_ERC_20,
  //   chainId: 2227728,
  //   functionName: "allowance",
  //   args: [account.address!, L2_BORROW_COLLATERAL],
  // });

  useEffect(() => {
    if (toastId.current && isRepaySuccess) {
      toast.success(
        "Repay Confirmed: : Transaction ID: " + repayReceipt.transactionHash,
        {
          id: toastId.current,
        },
      );
      toastId.current = undefined;
      onRepay?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepaySuccess]);

  const handleRepay = async () => {
    if (allowance !== toRepayBalance) {
      toast.error("You have not approve this amount");

      return handleApprove();
    }

    console.log("toRepayBalance", toRepayBalance);

    try {
      toastId.current = await toast.loading("Repaying...");
      await writeContract({
        abi: L2BorroweAbi,
        address: L2_BORROW_COLLATERAL,
        functionName: "repay",
        chainId: 2227728,
        args: [toRepayBalance ?? BigInt(0)],
      });
    } catch (error) {
      toast.error("Error borrowing", {
        id: toastId.current,
      });
      console.error(error);
      toastId.current = undefined;
    }
  };

  // const handleApprove = async () => {
  //   try {
  //     toastId.current = await toast.loading("Approving...");
  //     await approveContract({
  //       abi: erc20Abi,
  //       address: MOCK_ERC_20,
  //       functionName: "approve",
  //       chainId: 2227728,
  //       args: [L2_BORROW_COLLATERAL, toRepayBalance ?? BigInt(0)],
  //     });
  //   } catch (error) {
  //     toast.error("Error borrowing", {
  //       id: toastId.current,
  //     });
  //     toastId.current = undefined;
  //   }
  // };

  if (Number(allowance) === 0 || Number(allowance) < Number(toRepayBalance)) {
    return (
      <Button
        className="bg-[#ff684b] border border-[#ff684b] text-[#fff] font-medium py-5 px-6 rounded-lg w-full"
        onClick={handleApprove}
        variant="ghost"
        disabled={Number(borrorwedBalance) <= 0}
      >
        Approve ({toRepayBalance ? formatEther(toRepayBalance) : 0}) MockERC20
      </Button>
    );
  }

  return (
    <Button
      className="bg-[#ff684b] border border-[#ff684b] text-[#fff] font-medium py-5 px-6 rounded-lg w-full"
      onClick={handleRepay}
      variant="ghost"
      disabled={
        isRepayLoading ||
        Number(borrorwedBalance) <= 0 ||
        isAllowanceFetching ||
        isAllowanceLoading
      }
    >
      Repay {toRepayBalance ? formatEther(toRepayBalance) : 0} MockERC20
    </Button>
  );
}
