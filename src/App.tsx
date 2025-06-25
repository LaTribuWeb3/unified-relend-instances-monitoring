import { Refresh as RefreshIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { tokenService } from './services/tokenService';
import { TokenData } from './types';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontSize: 15,
  },
});

function formatNumber(num: number, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  if (Number.isInteger(num)) return num.toLocaleString();
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function App() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTokenData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tokenService.fetchTokenData();
      setTokens(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load token data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokenData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, background: '#f7f9fb', minHeight: '100vh', py: 4 }}>
        <AppBar position="static" color="default" elevation={1} sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
              L1 Token List
            </Typography>
            <IconButton
              color="primary"
              onClick={loadTokenData}
              disabled={loading}
              aria-label="refresh data"
            >
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth={false} sx={{ maxWidth: '1200px !important' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2, overflowX: 'auto' }}>
              <Table sx={{ minWidth: 1100 }}>
                <TableHead>
                  <TableRow sx={{ background: '#f0f4f8' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Network</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Token Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>L1 Wrapped Token Address</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Total Supply</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Total Supply USDC</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Ratio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.address} sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 64 }}>
                      <TableCell sx={{ fontWeight: 600 }}>{token.network}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight={500} fontSize={16}>
                          {token.name} ({token.symbol})
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`https://etherscan.io/address/${token.address}#code`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: 'none', fontFamily: 'monospace', fontSize: 15 }}
                        >
                          {token.address}
                        </Link>
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {formatNumber(token.totalSupply, 0)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {formatNumber(token.totalSupplyUSDC, 0)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {formatNumber(token.totalSupplyUSDC / token.totalSupply * 100, 2)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
