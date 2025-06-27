import { TradeLinkType } from "../TradeLink";

export class VelodromeTradeLink extends TradeLinkType {
  network: string;
  tokenAddress: string;

  constructor(symbol: string, network: string, tokenAddress: string) {
    super("Velodrome", symbol);
    this.network = network;
    this.tokenAddress = tokenAddress;
  }

  getTradeLink() {
    return `https://velodrome.finance/liquidity?filters=${this.network}&query=${this.symbol}`;
  }
}