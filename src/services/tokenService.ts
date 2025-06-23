import { TokenDefinition, TokenData } from '../types';
import { TokenDataComputer } from './tokenData/computers/TokenDataComputer';
import { TokenDataComputerFactory } from './tokenData/computers/TokenDataComputerFactory';

export const tokenService = {
  async fetchTokenData(): Promise<TokenData[]> {

    const response = await fetch(
      'https://raw.githubusercontent.com/relend-network/RelendAssets/refs/heads/feature/reorga/instances/current.json'
    );
    if (!response.ok) {
      throw new Error('Failed to fetch remote token data');
    }

    const tokenDefinitions: TokenDefinition[] = await response.json();

    const tokenDataPromises = tokenDefinitions.map(async (tokenDefinition) => {
      const tokenDataComputer: TokenDataComputer = TokenDataComputerFactory.create(tokenDefinition);
      try {
        const name = await tokenDataComputer.name();
        const symbol = await tokenDataComputer.symbol();
        return { address: tokenDefinition.L1WrappedTokenAddress, name, symbol };
      } catch (error) {
        console.error(`Failed to fetch name for token at address: ${tokenDefinition.L1WrappedTokenAddress}`, error);
        return { address: tokenDefinition.L1WrappedTokenAddress, name: 'Unknown Token', symbol: 'Unknown Symbol' };
      }
    });

    return Promise.all(tokenDataPromises);
  },
}; 