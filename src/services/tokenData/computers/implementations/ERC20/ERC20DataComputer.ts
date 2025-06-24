import { ethers } from "ethers";
import { TokenDefinition } from "../../../../../types";
import { TokenDataComputer } from "../../TokenDataComputer";

export abstract class ERC20DataComputer extends TokenDataComputer {
  private contract: ethers.Contract;

  constructor(private tokenDefinition: TokenDefinition) {
    super();
    const provider = new ethers.providers.JsonRpcProvider(this.getRpcUrl());
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
