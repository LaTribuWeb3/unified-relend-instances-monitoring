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
});

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
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              L1 Token List
            </Typography>
            <IconButton
              color="inherit"
              onClick={loadTokenData}
              disabled={loading}
              aria-label="refresh data"
            >
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>L1</TableCell>
                    <TableCell>Network</TableCell>
                    <TableCell>Token Name</TableCell>
                    <TableCell>L1 Wrapped Token Address</TableCell>
                    <TableCell>Total Supply</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token.address}>
                      <TableCell>{token.L1}</TableCell>
                      <TableCell>{token.network}</TableCell>
                      <TableCell>
                        {token.name} ({token.symbol})
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`https://etherscan.io/address/${token.address}#code`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ textDecoration: 'none' }}
                        >
                          {token.address}
                        </Link>
                      </TableCell>
                      <TableCell>{token.totalSupply}</TableCell>
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
