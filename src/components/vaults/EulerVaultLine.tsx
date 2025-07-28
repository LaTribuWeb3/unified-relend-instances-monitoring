import React from "react";
import { Card, Box, Typography, Link, useTheme, useMediaQuery } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddressLink from "../AddressLink";

interface EulerVaultLineProps {
  index: number;
  vault: {
    address: string;
    totalSupply: string;
    totalBorrows: string;
    borrowCap: string;
    chainId: number;
  };
  vaultsLoading: boolean;
  apys: {
    total: {
      supplyAPY: string;
      borrowAPY: string;
    };
  };
}

const EulerVaultLine: React.FC<EulerVaultLineProps> = ({
  index,
  vault,
  apys,
  vaultsLoading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        boxShadow: 2,
        p: { xs: 2, md: 2 },
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Header Row */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Vault #{index + 1}
            </Typography>
            <Link
              href={`https://app.euler.finance/vault/${vault.address}?network=swellchain`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Link>
          </Box>

          {/* Address Row */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              Address
            </Typography>
            <AddressLink 
              address={vault.address} 
              chainId={vault.chainId}
              fontSize={14}
            />
          </Box>

          {/* Metrics Grid */}
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: 2
          }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Supply
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {vaultsLoading ? "..." : vault.totalSupply}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Borrows
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {vaultsLoading ? "..." : vault.totalBorrows}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Supply APY
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {vaultsLoading
                  ? "..."
                  : `${parseFloat(apys.total.supplyAPY).toFixed(2)}%`}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Borrow APY
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {vaultsLoading
                  ? "..."
                  : `${parseFloat(apys.total.borrowAPY).toFixed(2)}%`}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Cap
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}
              >
                {vaultsLoading ? "..." : vault.borrowCap}
              </Typography>
            </Box>
          </Box>
        </>
      ) : (
        <>
          {/* Desktop Layout - Original horizontal layout */}
          {/* Vault Number */}
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 120 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.secondary" }}
            >
              Vault #{index + 1}
            </Typography>
          </Box>
          {/* Address */}
          <Box
            sx={{
              minWidth: 180,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
              Address
            </Typography>
            <AddressLink 
              address={vault.address} 
              chainId={vault.chainId}
              truncate={true}
              fontSize={15}
            />
          </Box>
          {/* Metrics */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Supply
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                {vaultsLoading ? "..." : vault.totalSupply}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Borrows
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                {vaultsLoading ? "..." : vault.totalBorrows}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Cap
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                {vaultsLoading ? "..." : vault.borrowCap}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Supply APY
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                {vaultsLoading
                  ? "..."
                  : `${parseFloat(apys.total.supplyAPY).toFixed(2)}%`}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                Borrow APY
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                {vaultsLoading
                  ? "..."
                  : `${parseFloat(apys.total.borrowAPY).toFixed(2)}%`}
              </Typography>
            </Box>
          </Box>
          {/* Arrow Link */}
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Link
              href={`https://app.euler.finance/vault/${vault.address}?network=swellchain`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                textDecoration: "none",
              }}
            >
              <ArrowForwardIcon />
            </Link>
          </Box>
        </>
      )}
    </Card>
  );
};

export default EulerVaultLine;
