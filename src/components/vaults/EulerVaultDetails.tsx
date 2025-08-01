import { PoolData, PoolTokenData } from "@/types/index.ts";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils.ts";
import { createPublicClient, http } from "viem";
import { swellchain } from "viem/chains";
import { abi as CLPoolAbi } from "../../abis/CLPool.abi.ts";
import { abi as swellEulerVaultAbi } from "../../abis/SwellEulerVault.abi.ts";
import { abi as USDeOFTAbi } from "../../abis/USDeOFT.abi.ts";
import { decodeCap } from "@/utils/CapUtils.ts";

export type RawVaultData = {
  address: string;
  type: string;
  name: string;
  totalSupply: number;
  balanceOfUnderlyingToken: number;
  debtTokenAddress: string;
  totalBorrows: number;
  totalSupplyDebtToken: number;
  borrowCap: number;
  chainId: number;
};

export type VaultData = {
  name: string;
  totalSupply: number;
  balanceOfUnderlyingToken: number;
  debtTokenAddress: string;
  totalBorrows: number;
  totalSupplyDebtToken: number;
  borrowCap: number;
  decimals: number;
};

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

  const dTokenAddress = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "dToken",
  })) as `0x${string}`;

  const dTokenContract = {
    address: dTokenAddress as `0x${string}`,
    abi: USDeOFTAbi,
  };

  const totalSupplyDebtToken = (await client.readContract({
    ...dTokenContract,
    functionName: "totalSupply",
  })) as bigint;

  const underlyingToken = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "asset",
  })) as `0x${string}`;

  const balanceOfUnderlyingToken = (await client.readContract({
    address: underlyingToken as `0x${string}`,
    abi: USDeOFTAbi,
    functionName: "balanceOf",
    args: [swellEulerVaultContract.address],
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

  const name = (await client.readContract({
    ...swellEulerVaultContract,
    functionName: "name",
  })) as string;

  const computedTotalSupply = balanceOfUnderlyingToken + borrow;

  return {
    name,
    balanceOfUnderlyingToken: Number(balanceOfUnderlyingToken.toString()) / 10 ** decimals,
    debtTokenAddress: dTokenAddress,
    totalSupply: Number(computedTotalSupply.toString()) / 10 ** decimals,
    totalSupplyDebtToken: Number(totalSupplyDebtToken.toString()) / 10 ** decimals,
    totalBorrows: Number(borrow.toString()) / 10 ** decimals,
    borrowCap: Number(decodeCap(caps[1])) / 10 ** decimals,
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
  poolType,
}: {
  poolAddress: string;
  poolType: string;
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
    type: poolType,
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
