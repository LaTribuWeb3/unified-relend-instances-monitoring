import { config } from "../config/Config";
import { TokenDefinition, TokenData } from "../types";
import { TokenDataComputer } from "./tokenData/computers/TokenDataComputer";
import { TokenDataComputerFactory } from "./tokenData/computers/TokenDataComputerFactory";

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = 3,
  delayMs = 1500
): Promise<T> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      const is429 =
        error?.message?.includes("429") ||
        error?.details?.includes(
          "Your app has exceeded its compute unit per seconds capacity"
        );
      if (attempt < maxRetries && is429) {
        console.warn(
          `[Retry] ${label} attempt ${attempt} failed due to rate limit. Retrying in ${
            delayMs / 1000
          }s...`,
          error
        );
        await new Promise((res) => setTimeout(res, delayMs));
      } else {
        if (attempt >= maxRetries) {
          console.error(
            `[Retry] ${label} failed after ${maxRetries} attempts.`,
            error
          );
        }
        throw error;
      }
    }
  }
  throw new Error(`[Retry] ${label} failed after ${maxRetries} attempts.`);
}

export const tokenService = {
  async fetchTokenData(): Promise<TokenData[]> {
    const response = await fetch(config.tokenDataUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch remote token data");
    }

    const tokenDefinitions: TokenDefinition[] = (await response.json()).filter(
      (tokenDefinition: TokenDefinition) => tokenDefinition.live
    );

    const tokenDataPromises = tokenDefinitions.map(async (tokenDefinition) => {
      const tokenDataComputer: TokenDataComputer =
        TokenDataComputerFactory.create(tokenDefinition);

      let name = "Unknown Token";
      let symbol = "Unknown Symbol";
      let totalSupply = 0;
      let totalSupplyUSDC = 0;

      try {
        name = await retryWithBackoff(
          () => tokenDataComputer.name(),
          `name(${tokenDefinition.L1WrappedTokenAddress})`
        );
        symbol = await retryWithBackoff(
          () => tokenDataComputer.symbol(),
          `symbol(${tokenDefinition.L1WrappedTokenAddress})`
        );
        totalSupply = await retryWithBackoff(
          () => tokenDataComputer.totalSupply(),
          `totalSupply(${tokenDefinition.L1WrappedTokenAddress})`
        );
        totalSupplyUSDC = await retryWithBackoff(
          () => tokenDataComputer.totalSupplyUSDC(),
          `totalSupplyUSDC(${tokenDefinition.L1WrappedTokenAddress})`
        );
      } catch (error) {
        console.error(
          `Failed to fetch name for token at address: ${tokenDefinition.L1WrappedTokenAddress}`,
          error
        );
      }
      
      return {
        address: tokenDefinition.L1WrappedTokenAddress,
        L2TokenAddress: tokenDefinition.L2TokenAddress,
        name,
        symbol,
        network: tokenDefinition.name,
        L1: tokenDefinition.network,
        totalSupply: totalSupply.toString(),
        totalSupplyUSDC: totalSupplyUSDC.toString(),
        bridgeUrl: tokenDefinition.BridgeUrl,
        L1BridgeAddress: tokenDefinition.L1BridgeAddress,
        L2BridgeAddress: tokenDefinition.L2BridgeAddress,
        L2ChainID: tokenDefinition.L2ChainID,
        isOFT: tokenDefinition.L2TokenIsOFT,
        lending: tokenDefinition.lending,
      };
    });

    return Promise.all(tokenDataPromises);
  },
};
