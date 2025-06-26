import { bitlayer, mainnet, sonic, swellchain } from "viem/chains";

const supportedChains = [mainnet, sonic, bitlayer, swellchain];

export function computeExplorerFromChainId(chainId: number): string {
  return (
    supportedChains.find((chain) => chain.id === chainId)
      ?.blockExplorers.default.url + "/address/"
  );
}