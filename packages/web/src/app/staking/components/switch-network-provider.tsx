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
    [walletClient, toChainId],
  );

  const handleSwitchNetwork = () => {
    walletClient.data?.switchChain({
      id: toChainId,
    });
  };

  if (!isCorrectNetwork) {
    return (
      <Button
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded w-full"
        onClick={handleSwitchNetwork}
      >
        Connect to {networkName}
      </Button>
    );
  }

  return <>{children}</>;
}
