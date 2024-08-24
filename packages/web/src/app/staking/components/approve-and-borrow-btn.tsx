import { Button } from "@/components/ui/button";
import { L2_BORROW_COLLATERAL } from "@/constants";
import { parseEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import L2BorroweAbi from "../../../abis/L2Borrow";
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
    data: borrowData,
    isPending: isL2Loading,
  } = useWriteContract();
  const {
    isLoading: isBorrowLoading,
    isSuccess: isApprovalSuccess,
    data: borrowReceipt,
    error,
  } = useWaitForTransactionReceipt({
    hash: borrowData,
    chainId: 2227728,
  });

  console.log(
    "borrowReceipt",
    borrowReceipt,
    isBorrowLoading,
    isApprovalSuccess,
    error,
  );

  useEffect(() => {
    if (toastId.current && isApprovalSuccess) {
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
  }, [isApprovalSuccess]);
  const handleApprove = async () => {
    try {
      toastId.current = await toast.loading("Borrowing 0.001 MockErc20...");
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
      className="bg-[#ff684b] border border-[#ff684b] text-[#fff] font-medium py-5 px-6 rounded-lg w-full"
      onClick={handleApprove}
      variant="ghost"
      disabled={isL2Loading || isBorrowLoading}
    >
      Borrow (0.001) MockERC20
    </Button>
  );
}
