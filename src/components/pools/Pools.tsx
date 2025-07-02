import { PoolData, PoolTokenData } from "@/types";
import { Box, Paper, Typography } from "@mui/material";

export const Pools = ({
  poolsData,
  poolsLoading,
}: {
  poolsData: PoolData[];
  poolsLoading: boolean;
}) => {
  if (poolsLoading) {
    return <div>Loading...</div>;
  }

  console.log("Pools Data:", poolsData);

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2, mb: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        Pools
      </Typography>
      {poolsLoading && <div>Loading...</div>}
      {poolsData.length > 0 &&
        !poolsLoading &&
        poolsData.map((poolData: PoolData) => (
          <Box key={poolData.address}>
            <Typography variant="body1">{poolData.name}</Typography>
            <Typography variant="body1">
              {poolData.poolTokenData.map((tokenData: PoolTokenData) => (
                <Box key={tokenData.address}>
                  <Typography variant="body1">{tokenData.name}</Typography>
                  <Typography variant="body1">{tokenData.symbol}</Typography>
                  <Typography variant="body1">
                    {tokenData.totalSupply}
                  </Typography>
                </Box>
              ))}
            </Typography>
          </Box>
        ))}
    </Paper>
  );
};
