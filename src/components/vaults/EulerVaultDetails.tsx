import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";

export const EulerVaultDetails = async ({ vaultAddress }: { vaultAddress: string }) => {
  const client = createPublicClient({
    chain: swellchain,
    transport: http(),
  });

  const totalSupply = await client.readContract({
    address: vaultAddress as `0x${string}`,
    abi: swellEulerVaultAbi,
    functionName: "totalSupply",
  }) as bigint;

  const borrow = await client.readContract({
    address: vaultAddress as `0x${string}`,
    abi: swellEulerVaultAbi,
    functionName: "totalBorrows",
  }) as bigint;

  const caps = await client.readContract({
    address: vaultAddress as `0x${string}`,
    abi: swellEulerVaultAbi,
    functionName: "caps",
  })
  
  const capsTest = caps as {supplyCap: number, borrowCap: number};
  
  return <div>EulerVaultDetails on vault {vaultAddress} with supply {totalSupply.toString()} and borrow {borrow.toString()} on a max borrow of {capsTest.borrowCap}</div>;
};