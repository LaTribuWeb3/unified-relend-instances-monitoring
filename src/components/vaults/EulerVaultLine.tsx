import React from "react";
import { Card, Box, Typography, Link } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { computeExplorerFromChainId } from "../../utils/ChainUtils";

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

const EulerVaultLine: React.FC<EulerVaultLineProps> = ({ index, vault, apys, vaultsLoading }) => (
  <Card
    sx={{
      width: '100%',
      borderRadius: 2,
      boxShadow: 2,
      p: 2,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 4,
      },
    }}
  >
    {/* Vault Number */}
    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        Vault #{index + 1}
      </Typography>
    </Box>
    {/* Address */}
    <Box sx={{ minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        Address
      </Typography>
      <Link
        href={`${computeExplorerFromChainId(vault.chainId)}${vault.address}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          textDecoration: 'none',
          color: '#1976d2',
          fontWeight: 500,
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          wordBreak: 'break-all',
        }}
      >
        {vault.address.slice(0, 8)}...{vault.address.slice(-6)}
      </Link>
    </Box>
    {/* Metrics */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Supply</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vaultsLoading ? '...' : vault.totalSupply}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Borrows</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vaultsLoading ? '...' : vault.totalBorrows}</Typography>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Cap</Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vaultsLoading ? '...' : vault.borrowCap}</Typography>
      </Box>
              <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Supply APY</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vaultsLoading ? '...' : `${parseFloat(apys.total.supplyAPY).toFixed(2)}%`}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Borrow APY</Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{vaultsLoading ? '...' : `${parseFloat(apys.total.borrowAPY).toFixed(2)}%`}</Typography>
        </Box>
    </Box>
    {/* Arrow Link */}
    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
      <Link
        href={`https://app.euler.finance/vault/${vault.address}?network=swellchain`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', textDecoration: 'none' }}
      >
        <ArrowForwardIcon />
      </Link>
    </Box>
  </Card>
);

export default EulerVaultLine; 