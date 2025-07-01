import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils.ts";

export type RawVaultData = {
  address: string;
  totalSupply: string;
  totalBorrows: string;
  borrowCap: string;
  chainId: number;
};

export interface VaultData {
  totalSupply: string;
  totalBorrows: string;
  borrowCap: string;
  decimals: number;
}

export const getVaultData = async ({
  vaultAddress,
}: {
  vaultAddress: string;
}): Promise<VaultData> => {
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

  return {
    totalSupply: FriendlyFormatNumber(Number(totalSupply.toString()) / 10 ** decimals),
    totalBorrows: FriendlyFormatNumber(Number(borrow.toString()) / 10 ** decimals),
    borrowCap: FriendlyFormatNumber(caps[1]),
    decimals,
  };
};

export const EulerVaultDetails = async ({
  vaultAddress,
}: {
  vaultAddress: string;
}) => {
  const vaultData = await getVaultData({ vaultAddress });

  return (
    <div>
      EulerVaultDetails on vault {vaultAddress} with supply{" "}
      {vaultData.totalSupply} and borrow{" "}
      {vaultData.totalBorrows} on a max borrow of{" "}
      {vaultData.borrowCap}
    </div>
  );
};
