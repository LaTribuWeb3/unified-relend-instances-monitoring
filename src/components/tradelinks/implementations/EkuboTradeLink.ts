import { TradeLinkType } from "../TradeLink";

export class EkuboTradeLink extends TradeLinkType {
  constructor(symbol: string) {
    super("Ekubo", symbol);
  }

  getTradeLink() {
    return `https://app.ekubo.org/?inputCurrency=USDC&outputCurrency=rUSDC-stark&amount=0`;
  }
}