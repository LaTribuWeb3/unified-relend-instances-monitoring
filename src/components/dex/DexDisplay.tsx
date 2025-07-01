import { Box, Typography } from "@mui/material";
import { VelodromeTradeLink } from "../tradelinks/implementations/VelodromeTradeLink";
import { TokenData } from "@/types";

const DexDisplay = ({ token }: { token: TokenData }) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mt: 2, mb: 0.5, fontWeight: 700, letterSpacing: 1 }}
      >
        DEX
      </Typography>
      <Box sx={{ mb: 2 }}>
        {VelodromeTradeLink.of(
          new VelodromeTradeLink("rUSDC", "Swellchain", token.address)
        )}
      </Box>
    </>
  );
};

export default DexDisplay;
