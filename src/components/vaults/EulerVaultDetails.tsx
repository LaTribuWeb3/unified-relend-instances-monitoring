import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils.ts";

export const EulerVaultDetails = async ({
  vaultAddress,
}: {
  vaultAddress: string;
}) => {
  const client = createPublicClient({
    chain: swellchain,
    transport: http(),
  });

  const swellEulerVaultContract = {
    address: vaultAddress as `0x${string}`,
    abi: swellEulerVaultAbi,
  };

  const totalSupply = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "totalSupply",
  })) as bigint;

  const borrow = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "totalBorrows",
  })) as bigint;

  const caps = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "caps",
  })) as [number, number];

  const decimals = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "decimals",
  })) as number;

  return (
    <div>
      EulerVaultDetails on vault {vaultAddress} with supply{" "}
      {FriendlyFormatNumber(Number(totalSupply.toString()) / 10 ** decimals)} and borrow{" "}
      {FriendlyFormatNumber(Number(borrow.toString()) / 10 ** decimals)} on a max borrow of{" "}
      {FriendlyFormatNumber(caps[1])}
    </div>
  );
};
