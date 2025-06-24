import { TokenDefinition, TokenData } from "../types";
import { TokenDataComputer } from "./tokenData/computers/TokenDataComputer";
import { TokenDataComputerFactory } from "./tokenData/computers/TokenDataComputerFactory";

export const tokenService = {
  async fetchTokenData(): Promise<TokenData[]> {
    const response = await fetch(
      "https://raw.githubusercontent.com/relend-network/RelendAssets/refs/heads/feature/reorga/instances/current.json"
    );
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
      
      try {
        name = await tokenDataComputer.name();
        symbol = await tokenDataComputer.symbol();
        totalSupply = await tokenDataComputer.totalSupply();
      } catch (error) {
        console.error(
          `Failed to fetch name for token at address: ${tokenDefinition.L1WrappedTokenAddress}`,
          error
        );
      }
      return {
        address: tokenDefinition.L1WrappedTokenAddress,
        name,
        symbol,
        network: tokenDefinition.name,
        L1: tokenDefinition.network,
        totalSupply: totalSupply
      };
    });

    return Promise.all(tokenDataPromises);
  },
};
