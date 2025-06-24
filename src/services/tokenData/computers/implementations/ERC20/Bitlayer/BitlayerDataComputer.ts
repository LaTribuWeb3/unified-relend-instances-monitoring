import { ERC20DataComputer } from "../ERC20DataComputer";

export class BitlayerDataComputer extends ERC20DataComputer {
  getRpcUrl(): string {
    return "https://rpc.bitlayer.org";
  }
}