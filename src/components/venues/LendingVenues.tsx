import { Box, Paper, Typography } from "@mui/material";
import EulerVaultLine from "../vaults/EulerVaultLine";
import { RawVaultData } from "../vaults/EulerVaultDetails";

export const LendingVenues = ({
  vaultsData,
  vaultsLoading,
  apys,
  tokenSymbol,
}: {
  vaultsData: RawVaultData[];
  vaultsLoading: boolean;
  apys: {
    euler: {
      borrowAPY: number;
      supplyAPY: number;
      source: string;
    };
    merkl: {
      borrowAPY: number;
      supplyAPY: number;
      source: string;
      aprRecord?: {
        lend?: {
          breakdowns: Array<{
            distributionType: string;
            identifier: string;
            type: string;
            value: number;
            timestamp: string;
          }>;
          cumulated: number;
          timestamp: string;
        };
        borrow?: {
          breakdowns: Array<{
            distributionType: string;
            identifier: string;
            type: string;
            value: number;
            timestamp: string;
          }>;
          cumulated: number;
          timestamp: string;
        };
      };
    };
    total: {
      borrowAPY: number;
      supplyAPY: number;
      source: string;
    };
  };
  tokenSymbol: string;
}) => {
  const vaultTypes = vaultsData.map((vault) => vault.type);
  const uniqueVaultTypes = [...new Set(vaultTypes)];

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        boxShadow: 2,
        mb: { xs: 2, md: 3 },
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.5rem", md: "2.125rem" },
        }}
      >
        Lending Venues
      </Typography>
      {vaultsLoading && <div>Loading...</div>}
      {vaultsData.length > 0 && !vaultsLoading && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {uniqueVaultTypes.map((type) => (
              <Box key={type} sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  {type === "Euler" && (
                    <img
                      src="/euler_logo_only.svg"
                      alt="Euler Logo"
                      style={{ height: 28, width: 28 }}
                    />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {type}
                  </Typography>
                </Box>
                {vaultsData
                  .filter((vault) => vault.type === type)
                  .map((vault: RawVaultData, index: number) => (
                    <EulerVaultLine
                      key={index}
                      index={index}
                      vault={vault}
                      apys={apys}
                      vaultsLoading={vaultsLoading}
                      tokenSymbol={tokenSymbol}
                    />
                  ))}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
