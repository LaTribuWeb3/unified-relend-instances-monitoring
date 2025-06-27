import {
  ArrowBack as ArrowBackIcon,
  Launch as LaunchIcon,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { mainnet } from "viem/chains";
import { tokenService } from "../services/tokenService";
import { TokenData } from "../types";
import AddressLink from "./AddressLink";
import { TradeLinkType } from "./tradelinks/TradeLink";
import { EkuboTradeLink } from "./tradelinks/implementations/EkuboTradeLink";
import { VelodromeTradeLink } from "./tradelinks/implementations/VelodromeTradeLink";

const TokenDetail: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                  Access the bridge to transfer {token.symbol} tokensA
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
                <Typography>DEX</Typography>
                {TradeLinkType.of(
                  new VelodromeTradeLink(
                    token.symbol,
                    token.network,
                    token.L2TokenAddress
                  )
                )}
                <Typography>Lending Venues</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Lend and borrow on Euler
                </Typography>
                <Link
                  href={"https://app.euler.finance/?asset=rUSDC&network=swellchain"}
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
                  Lend and borrow on Euler →
                </Link> { /* Lending: Euler, Vesu, Morpho (https://app.hyperbeat.org/earn) */}
                { /* DEX: Velodrome, Ekubo, Uniswapv3 (https://app.hyperswap.exchange/#/explore/explore-pools) */}
                {/* {TradeLinkType.of(new EkuboTradeLink(token.symbol))} */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TokenDetail;
