import { createPublicClient, http, PublicClient } from "viem";
import { mainnet } from "viem/chains";
import { TokenDefinition } from "../../../../../types";
import { TokenDataComputer } from "../../TokenDataComputer";

export abstract class ERC20DataComputer extends TokenDataComputer {
  private provider: PublicClient;
  private address = this.tokenDefinition.L1WrappedTokenAddress;
  private ERC20_ABI = [
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [{ "type": "string" }]
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [{ "type": "string" }]
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [{ "type": "uint256" }]
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [{ "type": "uint8" }]
    },
    {
      "type": "function",
      "name": "balanceOf",
      "inputs": [{ "type": "address" }],
      "outputs": [{ "type": "uint256" }]
    }
  ];
  private underlyingTokenAddress = this.tokenDefinition.L1UnderlyingTokenAddress;

  constructor(private tokenDefinition: TokenDefinition) {
    super();
    this.provider = createPublicClient({
      chain: mainnet,
      transport: http(this.getRpcUrl()),
    });
  }

  async name(): Promise<string> {
    const name = await this.provider.readContract({
      address: this.address as `0x${string}`,
      abi: this.ERC20_ABI,
      functionName: "name",
    }) as string;
    console.log("name", name);
    return name;
  }

  async symbol(): Promise<string> {
    const symbol = await this.provider.readContract({
      address: this.address as `0x${string}`,
      abi: this.ERC20_ABI,
      functionName: "symbol",
    }) as string;
    console.log("symbol", symbol);
    return symbol;
  }

  async totalSupply(): Promise<number> {
    const totalSupply = await this.provider.readContract({
      address: this.address as `0x${string}`,
      abi: this.ERC20_ABI,
      functionName: "totalSupply",
    }) as bigint;
    const decimals = await this.provider.readContract({
      address: this.address as `0x${string}`,
      abi: this.ERC20_ABI,
      functionName: "decimals",
    }) as bigint;
    console.log("totalSupply", totalSupply);
    console.log("decimals", decimals);
    return Number(totalSupply) / 10 ** Number(decimals);
  }

  async totalSupplyUSDC(): Promise<number> {
    const totalSupplyUSDC = await this.provider.readContract({
      address: this.underlyingTokenAddress as `0x${string}`,
      abi: this.ERC20_ABI,
      functionName: "balanceOf",
      args: [this.address as `0x${string}`],
    }) as bigint;
    const decimalsUSDC = await this.provider.readContract({
      address: this.underlyingTokenAddress as `0x${string}`,
      abi: this.ERC20_ABI,
      functionName: "decimals",
    }) as bigint;
    return Number(totalSupplyUSDC) / 10 ** Number(decimalsUSDC);
  }
}
