import { bitlayer, sonic, swellchain } from "viem/chains";

const supportedChains = [sonic, bitlayer, swellchain];

export function computeExplorerFromChainId(L2ChainID: number): string {
  return (
    supportedChains.find((chain) => chain.id === L2ChainID)
      ?.blockExplorers.default.url + "/address/"
  );
}