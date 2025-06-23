import { TokenDataComputer } from "../TokenDataComputer";

export class EmptyDataComputer extends TokenDataComputer {
  async name(): Promise<string> {
    return "";
  }

  async symbol(): Promise<string> {
    return "";
  }
}