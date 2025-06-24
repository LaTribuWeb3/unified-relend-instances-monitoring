import { TokenDataComputer } from "../TokenDataComputer";

export class EmptyDataComputer extends TokenDataComputer {
  async name(): Promise<string> {
    return "Undefined Token Name";
  }

  async symbol(): Promise<string> {
    return "Undefined Token Symbol";
  }

  getRpcUrl(): string {
    return "";
  }
}