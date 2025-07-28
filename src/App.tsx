import { ArrowForward as ArrowForwardIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';

import { mainnet } from 'viem/chains';
import L2DeploymentDetails from './components/L2DeploymentDetails';
import { tokenService } from './services/tokenService';
import { TokenData } from './types';
import AddressLink from './components/AddressLink';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const loadTokenData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tokenService.fetchTokenData();
      setTokens(data);
    } catch (err: any) {
      console.error("[DEBUG] Error in loadTokenData:", err);
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

      <Container maxWidth={false} sx={{ 
        maxWidth: '1200px !important',
        px: { xs: 1, sm: 2, md: 3 }
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: 3, 
              boxShadow: 2, 
              overflowX: 'auto',
              '& .MuiTable-root': {
                minWidth: { xs: 'auto', md: 800 },
              }
            }}
          >
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow sx={{ background: '#f0f4f8' }}>
                  <TableCell sx={{ fontWeight: 700, minWidth: { xs: 80, md: 120 } }}>
                    Network
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, minWidth: { xs: 140, md: 200 } }}>
                    Token Name
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 700, minWidth: 300 }}>
                      L1 Wrapped Token Address
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right', minWidth: { xs: 80, md: 120 } }}>
                    {isMobile ? 'Supply' : 'Total Supply'}
                  </TableCell>
                  {!isMobile && (
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right', minWidth: 120 }}>
                      Total Supply USDC
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center', minWidth: { xs: 60, md: 80 } }}>
                    Ratio
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'center', minWidth: 60 }}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.address} sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: { xs: 'auto', md: 64 } }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', md: '1rem' } }}>
                      {token.network}
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={500} 
                        fontSize={{ xs: 14, md: 16 }}
                        sx={{ 
                          wordBreak: 'break-word',
                          lineHeight: 1.2
                        }}
                      >
                        {token.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'block', fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                      >
                        ({token.symbol})
                      </Typography>
                      {isMobile && (
                        <Box sx={{ mt: 0.5 }}>
                          <AddressLink 
                            address={token.address} 
                            chainId={mainnet.id}
                            truncate={true}
                            fontSize={12}
                          />
                        </Box>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <AddressLink 
                          address={token.address} 
                          chainId={mainnet.id}
                          fontSize={15}
                        />
                      </TableCell>
                    )}
                    <TableCell 
                      align="right" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}
                    >
                      {formatNumber(Number(token.totalSupply), 0)}
                      {isMobile && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ display: 'block', fontSize: '0.75rem' }}
                        >
                          USDC: {formatNumber(Number(token.totalSupplyUSDC), 0)}
                        </Typography>
                      )}
                    </TableCell>
                    {!isMobile && (
                      <TableCell align="right" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {formatNumber(Number(token.totalSupplyUSDC), 0)}
                      </TableCell>
                    )}
                    <TableCell 
                      align="center" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', md: '1rem' }
                      }}
                    >
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
                          transition: 'all 0.2s ease-in-out',
                          p: { xs: 0.5, md: 1 }
                        }}
                      >
                        <ArrowForwardIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
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
          <Route path="/token/:address" element={<L2DeploymentDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
