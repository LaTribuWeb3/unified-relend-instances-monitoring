import { TokenDefinition } from "../../../types";
import { EmptyDataComputer } from "./implementations/EmptyDataComputer";
import { EthereumDataComputer } from "./implementations/EthereumDataComputer";
import { TokenDataComputer } from "./TokenDataComputer";

export class TokenDataComputerFactory {
  static create(tokenDefinition: TokenDefinition): TokenDataComputer {
    switch (tokenDefinition.network) {
      case "Ethereum":
        return new EthereumDataComputer(tokenDefinition);
      default:
        return new EmptyDataComputer();
    }
  }
}

