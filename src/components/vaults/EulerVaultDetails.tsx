import { PoolData, PoolTokenData } from "@/types/index.ts";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils.ts";
import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as CLPoolAbi } from "../../abis/CLPool.abi.ts";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";
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
    totalSupply: FriendlyFormatNumber(
      Number(totalSupply.toString()) / 10 ** decimals
    ),
    totalBorrows: FriendlyFormatNumber(
      Number(borrow.toString()) / 10 ** decimals
    ),
    borrowCap: FriendlyFormatNumber(caps[1]),
    decimals,
  };
};

export const getPoolTokenData = async (
  tokenAddress: string
): Promise<PoolTokenData> => {
  const client = createPublicClient({
    chain: swellchain,
    transport: http(),
  });

  const name = (await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "name",
  })) as string;

  const symbol = (await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "symbol",
  })) as string;

  const decimals = (await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "decimals",
  })) as number;

  const totalSupply = (await client.readContract({
    address: tokenAddress as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "totalSupply",
  })) as bigint;

  return {
    address: tokenAddress,
    name: name,
    symbol: symbol,
    decimals: decimals,
    totalSupply: FriendlyFormatNumber(
      Number(totalSupply.toString()) / 10 ** decimals
    ),
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

  const tokensAddress = (await client.readContract({
    address: poolAddress as `0x${string}`,
    abi: CLPoolAbi,
    functionName: "tokens",
  })) as [`0x${string}`, `0x${string}`];

  const token0Data = await getPoolTokenData(tokensAddress[0]);
  const token1Data = await getPoolTokenData(tokensAddress[1]);

  return {
    address: poolAddress,
    name: token0Data.symbol + "/" + token1Data.symbol,
    poolTokenData: [token0Data, token1Data],
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
      {vaultData.totalSupply} and borrow {vaultData.totalBorrows} on a max
      borrow of {vaultData.borrowCap}
    </div>
  );
};
