import {
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  useWriteContract,
} from "wagmi";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { erc20Abi } from "viem";
import { L2_BORROW_COLLATERAL, MOCK_ERC_20 } from "@/constants";

export const useTokenApproval = (toRepayBalance: bigint) => {
  const account = useAccount();
  const toastId = useRef<string | undefined>(undefined);

  const {
    writeContract,
    data,
    // isPending,
  } = useWriteContract();

  const {
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    data: approveReceipt,
    error: approveError,
  } = useWaitForTransactionReceipt({
    hash: data,
    chainId: 2227728,
  });

  useEffect(() => {
    if (isApproveSuccess) {
      toast.success("Approved", {
        id: toastId.current,
      });
      refetchAllowance();
      toastId.current = undefined;
    } else if (isApproveSuccess === false && approveError) {
      toast.error("Error approving, please try again", {
        id: toastId.current,
      });
      toastId.current = undefined;
    }
  }, [approveReceipt, isApproveSuccess, approveError]);

  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: isAllowanceLoading,
    isFetching: isAllowanceFetching,
  } = useReadContract({
    abi: erc20Abi,
    address: MOCK_ERC_20,
    chainId: 2227728,
    functionName: "allowance",
    args: [account?.address!, L2_BORROW_COLLATERAL],
  });

  const handleApprove = useCallback(async () => {
    try {
      toastId.current = toast.loading("Approving...");
      await writeContract({
        abi: erc20Abi,
        address: MOCK_ERC_20,
        functionName: "approve",
        chainId: 2227728,
        args: [L2_BORROW_COLLATERAL, toRepayBalance ?? BigInt(0)],
      });
    } catch (error) {
      toast.error("Error approving", {
        id: toastId.current,
      });
      toastId.current = undefined;
    }
  }, [toRepayBalance]);

  return {
    isApproveLoading,
    isApproveSuccess,
    approveReceipt,
    approveError,
    allowance,
    refetchAllowance,
    isAllowanceLoading,
    isAllowanceFetching,
    handleApprove,
  };
};
