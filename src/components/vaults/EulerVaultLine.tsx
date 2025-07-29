import { FriendlyFormatNumber } from "@/utils/DisplayUtils";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Card,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React from "react";
import AddressLink from "../AddressLink";

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

  const formatAPYWithBreakdown = (
    totalAPY: number,
    eulerAPY: number,
    merklAPY: number,
    type: 'supply' | 'borrow'
  ) => {
    if (!totalAPY && totalAPY !== 0) return "N/A";
    
    const total = totalAPY.toFixed(2);
    const euler = eulerAPY.toFixed(2);
    const merkl = merklAPY.toFixed(2);
    
    return `${total}% (Euler: ${euler}% ${type === 'supply' ? '+' : '-'} Merkl: ${merkl}%)`;
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

            {/* Supply APY with enhanced tooltip */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  padding: { xs: 1, md: 2 },
                  width: "40%",
                }}
              >
                Supply APY
              </TableCell>
              <TableCell sx={{ padding: { xs: 1, md: 2 } }}>
                {vaultsLoading ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    ...
                  </Typography>
                ) : (
                                     <Tooltip
                     title={
                       <Box>
                         <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                           Supply APY Breakdown:
                         </Typography>
                         <Typography variant="body2">
                           • Euler Lens: {apys?.euler?.supplyAPY?.toFixed(4)}% (Base lending rate)
                         </Typography>
                         <Typography variant="body2">
                           • Merkl Rewards: {apys?.merkl?.supplyAPY?.toFixed(4)}% (Token incentives)
                         </Typography>
                         
                         {/* Merkl APR Record Details */}
                         {apys?.merkl?.aprRecord?.lend && (
                           <Box sx={{ mt: 1, pl: 2, borderLeft: 1, borderColor: 'divider' }}>
                             <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                               Merkl Campaign Details:
                             </Typography>
                             {apys.merkl.aprRecord.lend.breakdowns.map((breakdown, index) => (
                               <Box key={index} sx={{ mt: 0.5 }}>
                                 <Typography variant="caption" sx={{ display: 'block' }}>
                                   • Type: {breakdown.type} ({breakdown.distributionType})
                                 </Typography>
                                 <Typography variant="caption" sx={{ display: 'block' }}>
                                   • Value: {breakdown.value.toFixed(4)}%
                                 </Typography>
                                 <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                                   • Campaign ID: {breakdown.identifier.slice(0, 10)}...
                                 </Typography>
                               </Box>
                             ))}
                             <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.8 }}>
                               Last updated: {new Date(parseInt(apys.merkl.aprRecord.lend.timestamp) * 1000).toLocaleString()}
                             </Typography>
                           </Box>
                         )}
                         
                         <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                           Total: {apys?.total?.supplyAPY?.toFixed(4)}%
                         </Typography>
                         <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                           Sources: {apys?.euler?.source} + {apys?.merkl?.source}
                         </Typography>
                       </Box>
                     }
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
                      {formatAPYWithBreakdown(
                        apys?.total?.supplyAPY,
                        apys?.euler?.supplyAPY,
                        apys?.merkl?.supplyAPY,
                        'supply'
                      )}
                    </Typography>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>

            {/* Borrow APY with enhanced tooltip */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  padding: { xs: 1, md: 2 },
                  width: "40%",
                }}
              >
                Borrow APY
              </TableCell>
              <TableCell sx={{ padding: { xs: 1, md: 2 } }}>
                {vaultsLoading ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    ...
                  </Typography>
                ) : (
                                     <Tooltip
                     title={
                       <Box>
                         <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                           Borrow APY Breakdown:
                         </Typography>
                         <Typography variant="body2">
                           • Euler Lens: {apys?.euler?.borrowAPY?.toFixed(4)}% (Base borrowing rate)
                         </Typography>
                         <Typography variant="body2">
                           • Merkl Rewards: -{apys?.merkl?.borrowAPY?.toFixed(4)}% (Borrow incentives)
                         </Typography>
                         
                         {/* Merkl APR Record Details for Borrow */}
                         {apys?.merkl?.aprRecord?.borrow && (
                           <Box sx={{ mt: 1, pl: 2, borderLeft: 1, borderColor: 'divider' }}>
                             <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                               Merkl Campaign Details:
                             </Typography>
                             {apys.merkl.aprRecord.borrow.breakdowns.map((breakdown, index) => (
                               <Box key={index} sx={{ mt: 0.5 }}>
                                 <Typography variant="caption" sx={{ display: 'block' }}>
                                   • Type: {breakdown.type} ({breakdown.distributionType})
                                 </Typography>
                                 <Typography variant="caption" sx={{ display: 'block' }}>
                                   • Value: {breakdown.value.toFixed(4)}%
                                 </Typography>
                                 <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                                   • Campaign ID: {breakdown.identifier.slice(0, 10)}...
                                 </Typography>
                               </Box>
                             ))}
                             <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.8 }}>
                               Last updated: {new Date(parseInt(apys.merkl.aprRecord.borrow.timestamp) * 1000).toLocaleString()}
                             </Typography>
                           </Box>
                         )}
                         
                         <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
                           Net Cost: {apys?.total?.borrowAPY?.toFixed(4)}%
                         </Typography>
                         <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                           Sources: {apys?.euler?.source} + {apys?.merkl?.source}
                         </Typography>
                       </Box>
                     }
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
                      {formatAPYWithBreakdown(
                        apys?.total?.borrowAPY,
                        apys?.euler?.borrowAPY,
                        apys?.merkl?.borrowAPY,
                        'borrow'
                      )}
                    </Typography>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default EulerVaultLine;
