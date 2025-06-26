import { ArrowForward as ArrowForwardIcon, Refresh as RefreshIcon } from '@mui/icons-material';
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
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';

import { mainnet } from 'viem/chains';
import TokenDetail from './components/TokenDetail';
import { tokenService } from './services/tokenService';
import { TokenData } from './types';
import { computeExplorerFromChainId } from './utils/ChainUtils';

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

function TokenList() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleTokenClick = (address: string) => {
    navigate(`/token/${address}`);
  };

  return (
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
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Ratio</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Details</TableCell>
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
                        href={`${computeExplorerFromChainId(mainnet.id)}${token.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ textDecoration: 'none', fontFamily: 'monospace', fontSize: 15 }}
                      >
                        {token.address}
                      </Link>
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {formatNumber(Number(token.totalSupply), 0)}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {formatNumber(Number(token.totalSupplyUSDC), 0)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                      {formatNumber((Number(token.totalSupplyUSDC) / Number(token.totalSupply)) * 100, 2)}%
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleTokenClick(token.address)}
                        sx={{ 
                          color: '#1976d2',
                          '&:hover': { 
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<TokenList />} />
          <Route path="/token/:address" element={<TokenDetail />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
