import { BigNumber, ethers } from "ethers";
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
      "function totalSupply() view returns (uint256)",
      "function decimals() view returns (uint8)",
    ];
    this.contract = new ethers.Contract(address, ERC20_ABI, provider);
  }

  async name(): Promise<string> {
    const name = await this.contract.name();
    console.log("name", name);
    return name;
  }

  async symbol(): Promise<string> {
    const symbol = await this.contract.symbol();
    console.log("symbol", symbol);
    return symbol;
  }

  async totalSupply(): Promise<number> {
    const totalSupply: BigNumber = await this.contract.totalSupply();
    const decimals = await this.contract.decimals();
    console.log("totalSupply", totalSupply);
    console.log("decimals", decimals);
    return totalSupply.div(10 ** decimals).toNumber();
  }
}
