export abstract class TokenDataComputer {
  abstract name(): Promise<string>;
  abstract symbol(): Promise<string>;
}