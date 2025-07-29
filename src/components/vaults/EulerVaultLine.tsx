import React from "react";
import {
  Card,
  Box,
  Typography,
  Link,
  useTheme,
  useMediaQuery,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddressLink from "../AddressLink";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils";

interface EulerVaultLineProps {
  index: number;
  vault: {
    address: string;
    name: string;
    totalSupply: number;
    totalSupplyDebtToken: number;
    balanceOfUnderlyingToken: number;
    debtTokenAddress: string;
    totalBorrows: number;
    borrowCap: number;
    chainId: number;
  };
  vaultsLoading: boolean;
  apys: {
    total: {
      supplyAPY: string;
      borrowAPY: string;
    };
  };
  tokenSymbol: string;
}

// Reusable metric row component
interface MetricRowProps {
  label: string;
  value: string | number | React.ReactNode;
  loading: boolean;
  formatAsNumber?: boolean;
  tokenSymbol?: string;
  tooltipValue?: string | number;
}

const MetricRow: React.FC<MetricRowProps> = ({
  label,
  value,
  loading,
  formatAsNumber = false,
  tokenSymbol = "",
  tooltipValue,
}) => {
  const displayValue = loading
    ? "..."
    : formatAsNumber
    ? `${FriendlyFormatNumber(value as number)} ${tokenSymbol}`
    : value;

  const tooltip = tooltipValue || value;

  return (
    <TableRow>
      <TableCell
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          padding: { xs: 1, md: 2 },
          width: "40%",
        }}
      >
        {label}
      </TableCell>
      <TableCell sx={{ padding: { xs: 1, md: 2 } }}>
        {loading || !tooltipValue || typeof value === "object" ? (
          <Typography
            variant="body2"
            sx={{
              fontFamily: typeof value === "object" ? "inherit" : "monospace",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {displayValue}
          </Typography>
        ) : (
          <Tooltip
            title={`${tooltip}${tokenSymbol ? ` ${tokenSymbol}` : ""}`}
            arrow
          >
            <Typography
              variant="body2"
              sx={{
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "help",
              }}
            >
              {displayValue}
            </Typography>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};

const EulerVaultLine: React.FC<EulerVaultLineProps> = ({
  index,
  vault,
  apys,
  vaultsLoading,
  tokenSymbol,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const formatAPY = (apy: string) => {
    return apy ? `${parseFloat(apy).toFixed(2)}%` : "N/A";
  };

  return (
    <Card
      sx={{
        width: "100%",
        borderRadius: 2,
        boxShadow: 2,
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "grey.50",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "flex-start", md: "space-between" },
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 1.5, md: 0 },
        }}
      >
        {/* Desktop: Vault name and address inline */}
        {!isMobile && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {vaultsLoading ? (
              "Loading..."
            ) : (
              <>
                {vault.name || `Vault #${index + 1}`} (
                <AddressLink
                  address={vault.address}
                  chainId={vault.chainId}
                  truncate={true}
                  fontSize={16}
                />
                )
              </>
            )}
          </Typography>
        )}

        {/* Mobile: Vault name on separate line */}
        {isMobile && (
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {vaultsLoading ? "Loading..." : vault.name || `Vault #${index + 1}`}
          </Typography>
        )}

        {/* Mobile: Address on separate line */}
        {isMobile && !vaultsLoading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddressLink
              address={vault.address}
              chainId={vault.chainId}
              truncate={true}
              fontSize={14}
            />
          </Box>
        )}

        {/* Open in Euler Chip */}
        {!vaultsLoading && (
          <Chip
            label="Open in Euler"
            icon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            onClick={() =>
              window.open(
                `https://app.euler.finance/vault/${vault.address}?network=swellchain`,
                "_blank"
              )
            }
            size="small"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              alignSelf: { xs: "flex-start", md: "center" },
              "&:hover": {
                bgcolor: "primary.dark",
              },
              cursor: "pointer",
            }}
          />
        )}
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableBody>
            <MetricRow
              label="Total Supply"
              value={vault.totalSupply}
              loading={vaultsLoading}
              formatAsNumber={true}
              tokenSymbol={tokenSymbol}
              tooltipValue={vault.totalSupply}
            />

            <MetricRow
              label="Balance of Underlying Token"
              value={vault.balanceOfUnderlyingToken}
              loading={vaultsLoading}
              formatAsNumber={true}
              tokenSymbol={tokenSymbol}
              tooltipValue={vault.balanceOfUnderlyingToken}
            />

            <MetricRow
              label="Supply Debt Token"
              value={vault.totalSupplyDebtToken}
              loading={vaultsLoading}
              formatAsNumber={true}
              tokenSymbol={tokenSymbol}
              tooltipValue={vault.totalSupplyDebtToken}
            />

            <MetricRow
              label="Borrows"
              value={vault.totalBorrows}
              loading={vaultsLoading}
              formatAsNumber={true}
              tokenSymbol={tokenSymbol}
              tooltipValue={vault.totalBorrows}
            />

            <MetricRow
              label="Cap"
              value={vault.borrowCap}
              loading={vaultsLoading}
              formatAsNumber={true}
              tokenSymbol={tokenSymbol}
              tooltipValue={vault.borrowCap}
            />

            <MetricRow
              label="Supply APY"
              value={formatAPY(apys?.total?.supplyAPY)}
              loading={vaultsLoading}
            />

            <MetricRow
              label="Borrow APY"
              value={formatAPY(apys?.total?.borrowAPY)}
              loading={vaultsLoading}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default EulerVaultLine;
