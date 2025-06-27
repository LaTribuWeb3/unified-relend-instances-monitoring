import { TokenDataComputer } from "../TokenDataComputer";

export class EmptyDataComputer extends TokenDataComputer {
  getRpcUrl(): string {
    return "";
  }

  async name(): Promise<string> {
    return "Undefined Token Name";
  }

  async symbol(): Promise<string> {
    return "Undefined Token Symbol";
  }

  async totalSupply(): Promise<number> {
    return 0;
  }

  async totalSupplyUSDC(): Promise<number> {
    return 0;
  }
}