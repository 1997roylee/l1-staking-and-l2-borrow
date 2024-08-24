import { useReadContract } from "wagmi";
import L2BorrowAbi from "../abis/L2Borrow";
import { L2_BORROW_COLLATERAL } from "@/constants";

export default function useLtv() {
  //   const account = useAccount();
  return useReadContract({
    abi: L2BorrowAbi,
    address: L2_BORROW_COLLATERAL,
    chainId: 2227728,
    functionName: "ltv",
  });
}
