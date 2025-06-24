import { TokenDefinition } from "../../../types";
import { EmptyDataComputer } from "./implementations/EmptyDataComputer";
import { BitlayerDataComputer } from "./implementations/ERC20/Bitlayer/BitlayerDataComputer";
import { EthereumDataComputer } from "./implementations/ERC20/Ethereum/EthereumDataComputer";
import { TokenDataComputer } from "./TokenDataComputer";

export class TokenDataComputerFactory {
  static create(tokenDefinition: TokenDefinition): TokenDataComputer {
    switch (tokenDefinition.network) {
      case "Ethereum":
        return new EthereumDataComputer(tokenDefinition);
      case "Bitlayer":
        return new BitlayerDataComputer(tokenDefinition);
      default:
        return new EmptyDataComputer();
    }
  }
}

