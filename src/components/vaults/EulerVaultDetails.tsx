import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";

export const EulerVaultDetails = async ({ vaultAddress }: { vaultAddress: string }) => {
  const client = createPublicClient({
    chain: swellchain,
    transport: http(),
  });

  const swellEulerVaultContract = {
    address: vaultAddress as `0x${string}`,
    abi: swellEulerVaultAbi
  }

  const totalSupply = await client.readContract({
    ...swellEulerVaultContract,
    functionName: "totalSupply",
  }) as bigint;

  const borrow = await client.readContract({
    ...swellEulerVaultContract,
    functionName: "totalBorrows",
  }) as bigint;

  const caps = await client.readContract({
    ...swellEulerVaultContract,
    functionName: "caps",
  }) as [number, number];
  
  return <div>EulerVaultDetails on vault {vaultAddress} with supply {totalSupply.toString()} and borrow {borrow.toString()} on a max borrow of {caps[1]}</div>;
};