import {
  ArrowBack as ArrowBackIcon,
  Launch as LaunchIcon,
  AccountBalance as VaultIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Paper,
  Toolbar,
  Typography,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { mainnet } from "viem/chains";
import { tokenService } from "../services/tokenService";
import { TokenData } from "../types";
import AddressLink from "./AddressLink";
import { getVaultData, VaultData } from "./vaults/EulerVaultDetails";
import { computeExplorerFromChainId } from "../utils/ChainUtils";

const TokenDetail: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vaultsData, setVaultsData] = useState<
    {
      address: string;
      totalSupply: string;
      totalBorrows: string;
      borrowCap: string;
      chainId: number;
    }[]
  >([]);
  const [vaultsLoading, setVaultsLoading] = useState(false);

  useEffect(() => {
    const loadTokenData = async () => {
      if (!address) {
        setError("Token address not provided");
        setLoading(false);
        return;
      }

      try {
        const allTokens = await tokenService.fetchTokenData();
        const foundToken = allTokens.find((t) => t.address === address);

        if (foundToken) {
          setToken(foundToken);
        } else {
          setError("Token not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load token data");
      } finally {
        setLoading(false);
      }
    };

    loadTokenData();
  }, [address]);

  useEffect(() => {
    if (!token) return;

    const loadVaultsDetails = async () => {
      setVaultsLoading(true);
      try {
        const vaultsDetails = await Promise.all(
          token.lending.map(async (lending) => {
            try {
              const vaultData: VaultData = await getVaultData({
                vaultAddress: lending.address,
              });
              return {
                address: lending.address,
                totalSupply: vaultData.totalSupply,
                totalBorrows: vaultData.totalBorrows,
                borrowCap: vaultData.borrowCap,
                chainId: token.L2ChainID,
              };
            } catch (error) {
              return {
                address: lending.address,
                totalSupply: "Error",
                totalBorrows: "Error",
                borrowCap: "Error",
                chainId: token.L2ChainID,
              };
            }
          })
        );
        setVaultsData(vaultsDetails);
      } finally {
        setVaultsLoading(false);
      }
    };

    loadVaultsDetails();
  }, [token]);

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error || !token) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography color="error" variant="h6" gutterBottom>
          {error || "Token not found"}
        </Typography>
        <Button onClick={handleBack} variant="contained" sx={{ mt: 2 }}>
          Back to Token List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f7f9fb", minHeight: "100vh" }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Token Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {token.name}
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Token Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Symbol:</strong> {token.symbol}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Network:</strong> {token.network}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Address:</strong>{" "}
              <AddressLink address={token.address} chainId={mainnet.id} />
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>L2 Token Address:</strong>{" "}
              <AddressLink
                address={token.L2TokenAddress}
                chainId={token.L2ChainID}
              />
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Total Supply:</strong> {token.totalSupply}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Total Supply USDC:</strong> {token.totalSupplyUSDC}
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LaunchIcon sx={{ mr: 1 }} />
                  Bridge
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Access the bridge to transfer {token.symbol}
                </Typography>
                {token.isOFT && (
                  <Box
                    component="img"
                    src="https://layerzero.network/static/logo.svg"
                    alt="LayerZero"
                    sx={{
                      height: 32,
                      width: "auto",
                      mb: 2,
                      filter: "brightness(0)",
                    }}
                  />
                )}
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Link
                    href={token.bridgeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: "none",
                      color: "#1976d2",
                      fontWeight: 500,
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Open Bridge →
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LaunchIcon sx={{ mr: 1 }} />
                  Partners
                </Typography>

                {/* DEX Section */}
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mt: 2, mb: 0.5, fontWeight: 700, letterSpacing: 1 }}
                >
                  DEX
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  View liquidity and exchange rUSDC-swell on Velodrome
                </Typography>
                <Link
                  href="https://velodrome.finance"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: "none",
                    color: "#1976d2",
                    fontWeight: 500,
                    display: "block",
                    mb: 2,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  View on Velodrome &rarr;
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 2 }}>
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
          {vaultsData.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Lending Markets
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {vaultsData.map((vault, index) => (
                  <Card
                    key={index}
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
                    {/* Vault Icon and Number */}
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 120 }}>
                      <VaultIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
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
                ))}
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default TokenDetail;
