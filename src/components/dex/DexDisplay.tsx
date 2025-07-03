import { Box, Typography } from "@mui/material";
import { TokenData } from "@/types";
import * as chains from "viem/chains";
import { Chain } from "viem";

function getChain(id: number) {
  return Object.values(chains).find((chain: Chain) => chain.id === id);
}

const DexDisplay = ({ token }: { token: TokenData }) => {
  const networkName = getChain(token.L2ChainID)?.name;

  if (!networkName) {
    console.log("No network found for chain ID: " + token.L2ChainID);
    return null;
  }

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
        {token.pools.map((pool) => {
          if (pool.type === "Velodrome") {
            return (
              <a href={`https://velodrome.finance/liquidity?filters=${networkName}&query=${pool.address}`}>
                {`https://velodrome.finance/liquidity?filters=${networkName}&query=${pool.address}`}
              </a>
            );
          }
        })}
      </Box>
    </>
  );
};

export default DexDisplay;
