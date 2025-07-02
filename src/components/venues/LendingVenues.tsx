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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Lend and borrow on Euler
      </Typography>
      {vaultsLoading && <div>Loading...</div>}
      {vaultsData.length > 0 && !vaultsLoading && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            Lending Markets
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {vaultsData.map((vault: RawVaultData, index: number) => (
              <EulerVaultLine
                key={index}
                index={index}
                vault={vault}
                vaultsLoading={vaultsLoading}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
