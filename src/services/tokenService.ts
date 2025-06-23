import { ethers } from 'ethers';
import { MockTokenInfo, TokenData } from '../types';

const ERC20_ABI = ['function name() view returns (string)', 'function symbol() view returns (string)'];

export const tokenService = {
  async fetchTokenData(): Promise<TokenData[]> {
    const rpcUrl = process.env.REACT_APP_L1_RPC_URL;
    if (!rpcUrl) {
      throw new Error(
        'REACT_APP_L1_RPC_URL is not defined in the environment variables. Please check your .env file and restart the server.'
      );
    }

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    const response = await fetch('/mock-input.json');
    if (!response.ok) {
      throw new Error('Failed to fetch mock-input.json');
    }

    const mockTokens: MockTokenInfo[] = await response.json();

    const tokenDataPromises = mockTokens.map(async (tokenInfo) => {
      const address = tokenInfo.L1WrappedTokenAddress;
      const contract = new ethers.Contract(address, ERC20_ABI, provider);
      try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        return { address, name, symbol };
      } catch (error) {
        console.error(`Failed to fetch name for token at address: ${address}`, error);
        return { address, name: 'Unknown Token', symbol: 'Unknown Symbol' };
      }
    });

    return Promise.all(tokenDataPromises);
  },
}; 