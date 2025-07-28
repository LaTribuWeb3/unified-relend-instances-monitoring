import { PoolData, PoolTokenData } from "@/types";
import { Box, Paper, Typography } from "@mui/material";
import AddressLink from "../AddressLink";

export const Pools = ({
  poolsData,
  poolsLoading,
  chainId,
}: {
  poolsData: PoolData[];
  poolsLoading: boolean;
  chainId: number;
}) => {
  console.log("Pools Data:", poolsData);
  console.log("Pools Loading:", poolsLoading);

  const poolTypes = poolsData.map((pool) => pool.type);
  const uniquePoolTypes = [...new Set(poolTypes)];

  return (
    <Paper sx={{ 
      p: { xs: 2, sm: 3, md: 4 }, 
      borderRadius: 3, 
      boxShadow: 2, 
      mb: { xs: 2, md: 3 }
    }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ 
          fontWeight: 700,
          fontSize: { xs: '1.5rem', md: '2.125rem' }
        }}
      >
        Pools
      </Typography>

      {poolsLoading && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading pools...
        </Typography>
      )}

      {!poolsLoading && poolsData.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          No pools available for this token.
        </Typography>
      )}

      {!poolsLoading && poolsData.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {uniquePoolTypes.map((type) => (
            <Box key={type}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                {type === "Velodrome" && (
                  <img 
                    src="/velodrome_logo_only.svg" 
                    alt="Velodrome Finance" 
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "block"
                    }}
                  />
                )}
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600 }}
                >
                  {type}
                </Typography>
              </Box>
              {poolsData
                .filter((pool) => pool.type === type)
                .map((poolData: PoolData) => (
                  <Box
                    key={poolData.address}
                    sx={{
                      mb: { xs: 2, md: 3 },
                      p: { xs: 1.5, md: 2 },
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        fontSize: { xs: '1rem', md: '1.25rem' }
                      }}
                    >
                      {poolData.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        mb: 1,
                        fontSize: { xs: '0.875rem', md: '0.875rem' }
                      }}
                    >
                      Address:{" "}
                      <AddressLink 
                        address={poolData.address} 
                        chainId={chainId}
                        fontSize={14}
                      />
                    </Typography>

                    {poolData.poolTokenData.length > 0 ? (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          Pool Tokens:
                        </Typography>
                        {poolData.poolTokenData.map(
                          (tokenData: PoolTokenData) => (
                            <Box
                              key={tokenData.address}
                              sx={{
                                ml: 2,
                                mb: 1,
                                p: 1,
                                backgroundColor: "#f5f5f5",
                                borderRadius: 1,
                              }}
                            >
                              <Typography variant="body2">
                                <strong>{tokenData.name}</strong> (
                                {tokenData.symbol})
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Supply: {tokenData.totalSupply}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No token data available for this pool.
                      </Typography>
                    )}
                  </Box>
                ))}
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
};
