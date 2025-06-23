import { ethers } from "ethers";
import { TokenDefinition } from "../../../../types";
import { TokenDataComputer } from "../TokenDataComputer";

export class EthereumDataComputer extends TokenDataComputer {
  private contract: ethers.Contract;

  constructor(private tokenDefinition: TokenDefinition) {
    super();
    const rpcUrl = process.env.REACT_APP_L1_RPC_URL;
    if (!rpcUrl) {
      throw new Error(
        "REACT_APP_L1_RPC_URL is not defined in the environment variables. Please check your .env file and restart the server."
      );
    }
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const address = this.tokenDefinition.L1WrappedTokenAddress;
    const ERC20_ABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
    ];
    this.contract = new ethers.Contract(address, ERC20_ABI, provider);
  }

  async name(): Promise<string> {
    return await this.contract.name();
  }

  async symbol(): Promise<string> {
    return await this.contract.symbol();
  }
}
