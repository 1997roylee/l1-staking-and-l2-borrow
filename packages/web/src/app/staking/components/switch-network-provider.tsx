import { Button } from "@/components/ui/button";
import { PropsWithChildren, useMemo } from "react";
import { useWalletClient } from "wagmi";

export type SwitchNetworkProviderProps = {
  toChainId: number;
  networkName: string;
} & PropsWithChildren;

export default function SwitchNetworkProvider({
  toChainId,
  networkName,
  children,
}: SwitchNetworkProviderProps) {
  const walletClient = useWalletClient();
  const isCorrectNetwork = useMemo(
    () => walletClient.data?.chain.id === toChainId,
    [walletClient.data?.chain, toChainId],
  );

  const handleSwitchNetwork = () => {
    walletClient.data?.switchChain({
      id: toChainId,
    });
  };

  if (!isCorrectNetwork) {
    return (
      <Button
        className="bg-white border border-[#ff684b] text-[#101010] font-medium py-5 px-6 rounded-lg w-full"
        onClick={handleSwitchNetwork}
        variant="ghost"
      >
        Connect to {networkName}
      </Button>
    );
  }

  return <>{children}</>;
}
