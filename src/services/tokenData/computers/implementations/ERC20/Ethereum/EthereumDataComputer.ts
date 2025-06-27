import { ERC20DataComputer } from "../ERC20DataComputer";
import { TokenDefinition } from "../../../../../../types";

export class EthereumDataComputer extends ERC20DataComputer {
  constructor(tokenDefinition: TokenDefinition) {
    super(tokenDefinition);
  }

  getRpcUrl(): string {
    const rpcUrl = import.meta.env.VITE_L1_RPC_URL;
    if (!rpcUrl) {
      throw new Error(
        "VITE_L1_RPC_URL is not defined in the environment variables. Please check your .env file and restart the server."
      );
    }
    return rpcUrl;
  }
}
