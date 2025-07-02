import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";
import { abi as CLPoolAbi } from "../../abis/CLPool.abi.ts";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils.ts";
import { PoolData } from "@/types/index.ts";
import { abi as USDeOFTAbi } from "../../abis/USDeOFT.abi.ts";

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

export const getPoolData = async ({
  poolAddress,
}: {
  poolAddress: string;
}): Promise<PoolData> => {
  const client = createPublicClient({
    chain: swellchain,
    transport: http(),
  });

  const token0Address = (await client.readContract({
    address: poolAddress as `0x${string}`,
    abi: CLPoolAbi,
    functionName: "token0",
  })) as `0x${string}`;

  const token0Name = (await client.readContract({
    address: token0Address as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "name",
  })) as string;

  const token0Symbol = (await client.readContract({
    address: token0Address as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "symbol",
  })) as string;

  const token0Decimals = (await client.readContract({
    address: token0Address as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "decimals",
  })) as number;

  const token0TotalSupply = (await client.readContract({
    address: token0Address as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "totalSupply",
  })) as bigint;

  return {
    address: poolAddress,
    name: "Pool name",
    poolTokenData: [{
      address: token0Address,
      name: token0Name,
      symbol: token0Symbol,
      decimals: token0Decimals,
      totalSupply: FriendlyFormatNumber(Number(token0TotalSupply.toString()) / 10 ** token0Decimals),
    }],
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
