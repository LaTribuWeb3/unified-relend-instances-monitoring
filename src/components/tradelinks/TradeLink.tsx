import { Link, Typography } from "@mui/material";

export abstract class TradeLinkType {
  abstract getTradeLink(): string;
  public exchangeName: string;
  public symbol: string;

  constructor(exchangeName: string, symbol: string) {
    this.exchangeName = exchangeName;
    this.symbol = symbol;
  }

  static of(tradeLinkType: TradeLinkType) {
    return (
      <>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          View liquidity and trade {tradeLinkType.symbol} on {tradeLinkType.exchangeName}
        </Typography>
        <Link
          href={tradeLinkType.getTradeLink()}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textDecoration: "none",
            color: "#1976d2",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          View on {tradeLinkType.exchangeName} →
        </Link>
      </>
    );
  }
}