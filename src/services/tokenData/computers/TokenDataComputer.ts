export abstract class TokenDataComputer {
  abstract getRpcUrl(): string;
  abstract name(): Promise<string>;
  abstract symbol(): Promise<string>;
  abstract totalSupply(): Promise<number>;
  abstract totalSupplyUSDC(): Promise<number>;
}