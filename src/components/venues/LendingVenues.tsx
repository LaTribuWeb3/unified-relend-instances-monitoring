import { Box, Paper, Typography } from "@mui/material";
import EulerVaultLine from "../vaults/EulerVaultLine";
import { RawVaultData } from "../vaults/EulerVaultDetails";

export const LendingVenues = ({
  vaultsData,
  vaultsLoading,
}: {
  vaultsData: RawVaultData[];
  vaultsLoading: boolean;
}) => {
  const vaultTypes = vaultsData.map((vault) => vault.type);
  const uniqueVaultTypes = [...new Set(vaultTypes)];

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2, mb: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        Lending Venues
      </Typography>
      {vaultsLoading && <div>Loading...</div>}
      {vaultsData.length > 0 && !vaultsLoading && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {uniqueVaultTypes.map((type) => (
              <Box key={type} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  {type === "Euler" && (
                    <img
                      src="/euler_logo_only.svg"
                      alt="Euler Logo"
                      style={{ height: 28, width: 28 }}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >
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
                      vaultsLoading={vaultsLoading}
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
