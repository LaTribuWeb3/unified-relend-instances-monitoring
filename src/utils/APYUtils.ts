/**
 * Combined APY Calculator - Euler Lens + Merkl Rewards
 *
 * This script combines APY data from:
 * 1. Euler Finance Lens contracts (base lending APY)
 * 2. Merkl rewards API (additional token incentives)
 *
 * Result: Total Supply/Borrow APY = Base APY + Rewards APY
 */

import { createPublicClient, http, parseAbi } from "viem";
import { MerklApi } from "@merkl/api";

// Configuration
const SWELLCHAIN_ID = 1923;
const VAULT_ADDRESS = "0xc5976e0356f0A3Ce8307fF08C88bB05933F88761";

// Swellchain RPC configuration
const swellchain = {
  id: 1923,
  name: "Swellchain",
  rpcUrls: {
    default: { http: ["https://swell-mainnet.alt.technology"] },
  },
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
};

// UtilsLens contract ABI (simplified)
const UTILS_LENS_ABI = parseAbi([
  "function getAPYs(address vault) external view returns (uint256 borrowAPY, uint256 supplyAPY)",
]);

// Contract addresses (these need to be found for Swellchain)
const UTILS_LENS_ADDRESS = "0x681eD47409AF872B7EE81885cDb6A6cF3b2B9242"; // TODO: Find correct address

interface APYResult {
  borrowAPY: number;
  supplyAPY: number;
  source: string;
}

/**
 * Fetch base APY from Euler Lens contracts
 */
async function getEulerLensAPY(): Promise<APYResult> {
  try {
    const client = createPublicClient({
      chain: swellchain,
      transport: http(),
    });

    // Note: This will fail until we find the correct UtilsLens address
    const result = await client.readContract({
      address: UTILS_LENS_ADDRESS as `0x${string}`,
      abi: UTILS_LENS_ABI,
      functionName: "getAPYs",
      args: [VAULT_ADDRESS as `0x${string}`],
    });

    // Convert from ray units (1e27) to percentages
    const borrowAPY = Number(result[0]) / 1e25; // Convert to percentage
    const supplyAPY = Number(result[1]) / 1e25;

    return {
      borrowAPY,
      supplyAPY,
      source: "Euler Lens",
    };
  } catch (error) {
    throw new Error("  Euler Lens unavailable (contract address needed)");
  }
}

/**
 * Fetch rewards APY from Merkl API (with simple caching)
 */
async function getMerklRewardsAPY(): Promise<APYResult> {
  const merkl = MerklApi("https://api.merkl.xyz").v4;

  // Query opportunities for the vault
  const opportunities = await (merkl.opportunities as any).index.get({
    query: { chainId: SWELLCHAIN_ID.toString() },
  });

  // Find vault-specific opportunities
  if (!opportunities.data) {
    throw new Error("No opportunities found");
  }

  const vaultOpportunities = opportunities.data.filter(
    (opp: any) =>
      opp.address?.toLowerCase() === VAULT_ADDRESS.toLowerCase() ||
      JSON.stringify(opp).toLowerCase().includes(VAULT_ADDRESS.toLowerCase())
  );

  const liveVaultOpportunities = vaultOpportunities.filter(
    (opp: any) => opp.status.toLowerCase() === "live"
  );

  const borrowAPY = liveVaultOpportunities
    .filter((opp: any) => opp.action.toLowerCase() === "borrow")
    .map((opp: any) => opp.apr);
  const lendAPY = liveVaultOpportunities
    .filter((opp: any) => opp.action.toLowerCase() === "lend")
    .map((opp: any) => opp.apr);

  if (borrowAPY.length > 1) {
    throw new Error("Multiple borrow opportunities found");
  }
  if (lendAPY.length > 1) {
    throw new Error("Multiple lend opportunities found");
  }

  return {
    borrowAPY: parseFloat(borrowAPY[0]) || 0,
    supplyAPY: parseFloat(lendAPY[0]) || 0,
    source: "Merkl API",
  };
}

/**
 * Calculate combined APY from both sources
 */
export async function calculateCombinedAPY() {

  // Fetch APY data from both sources
  const [eulerAPY, merklAPY] = await Promise.all([
    getEulerLensAPY(),
    getMerklRewardsAPY(),
  ]);

  // Calculate totals
  const totalBorrowAPY = eulerAPY.borrowAPY - merklAPY.borrowAPY;
  const totalSupplyAPY = eulerAPY.supplyAPY + merklAPY.supplyAPY;

  return {
    euler: eulerAPY,
    merkl: merklAPY,
    total: {
      borrowAPY: totalBorrowAPY,
      supplyAPY: totalSupplyAPY,
      source: "Combined",
    },
  };
}