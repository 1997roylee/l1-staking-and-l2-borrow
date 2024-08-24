import { Button } from "@/components/ui/button";
import { L2_BORROW_COLLATERAL } from "@/constants";
import { parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import L2BorroweAbi from "../../abis/L2Borrow";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export type ApproveAndBorrowBtnProps = {
  onBorrow?: () => void;
};

export default function ApproveAndBorrowBtn({
  onBorrow,
}: ApproveAndBorrowBtnProps) {
  const toastId = useRef<string | undefined>(undefined);

  const {
    writeContract,
    data: approveData,
    isPending: isL2Loading,
  } = useWriteContract();
  const {
    isLoading: isBorrowLoading,
    isSuccess: isApprovalSuccess,
    data: borrowReceipt,
  } = useWaitForTransactionReceipt({
    hash: approveData,
    chainId: 2227728,
  });

  useEffect(() => {
    if (toastId.current && isApprovalSuccess && !isBorrowLoading) {
      toast.success(
        "Borrow Confirmed: Transaction ID: " + borrowReceipt.transactionHash,
        {
          id: toastId.current,
          duration: 10000,
        },
      );
      toastId.current = undefined;

      onBorrow?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApprovalSuccess, isBorrowLoading]);
  const handleApprove = async () => {
    try {
      toastId.current = await toast.loading("Borrowing...");
      await writeContract({
        abi: L2BorroweAbi,
        address: L2_BORROW_COLLATERAL,
        functionName: "borrow",
        chainId: 2227728,
        args: [parseEther("0.001")],
      });
    } catch (error) {
      toast.error("Error borrowing", {
        id: toastId.current,
      });
      toastId.current = undefined;
    }
  };

  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded w-full"
      onClick={handleApprove}
      disabled={isL2Loading || isBorrowLoading}
    >
      Borrow 0.001 MockERC20
    </Button>
  );
}
