import {
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Toolbar,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { tokenService } from "../services/tokenService";
import { PoolData, TokenData } from "../types";
import BridgeDisplay from "./bridge/BridgeDisplay";
import PartnersDisplay from "./partners/PartnersDisplay";
import TokenInformation from "./token-info/TokenInformation";
import {
  getPoolData,
  getVaultData,
  RawVaultData,
  VaultData,
} from "./vaults/EulerVaultDetails";
import { LendingVenues } from "./venues/LendingVenues";
import { Pools } from "./pools/Pools";
import { calculateCombinedAPY } from "../utils/APYUtils";

const L2DeploymentDetails: React.FC = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vaultsData, setVaultsData] = useState<RawVaultData[]>([]);
  const [vaultsLoading, setVaultsLoading] = useState(false);
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [apys, setApys] = useState<any>(null);

  const loadApys = async () => {
    const apys = await calculateCombinedAPY();
    setApys(apys);
  };

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
    loadApys();
  }, [address]);

  useEffect(() => {
    if (!token) return;

    const loadVaultsDetails = async () => {
      setVaultsLoading(true);
      try {
        const vaultsDetails = await Promise.all(
          token.lending.map(async (lending) => {
            let returnValue = {
              address: lending.address,
              type: lending.type,
              totalSupply: "Error",
              totalBorrows: "Error",
              borrowCap: "Error",
              chainId: token.L2ChainID,
            };

            try {
              const vaultData: VaultData = await getVaultData({
                vaultAddress: lending.address,
              });
              returnValue.totalSupply = vaultData.totalSupply;
              returnValue.totalBorrows = vaultData.totalBorrows;
              returnValue.borrowCap = vaultData.borrowCap;
            } catch (error) {
              console.log("Error when fetching lending venue " + lending.address);
            }

            return returnValue;
          })
        );
        setVaultsData(vaultsDetails);
      } finally {
        setVaultsLoading(false);
      }
    };

    loadVaultsDetails();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const loadPoolsDetails = async () => {
      setPoolsLoading(true);
      try {
        const poolsDetails = await Promise.all(
          token.pools.map(async (pool) => {
            let returnValue: PoolData = {
              address: pool.address,
              name: pool.name,
              type: pool.type,
              poolTokenData: pool.poolTokenData,
            };

            try {
              const poolData: PoolData = await getPoolData({
                poolAddress: pool.address,
                poolType: pool.type,
              });
              returnValue.poolTokenData = poolData.poolTokenData;
              returnValue.name = poolData.name;
            } catch (error) {
              console.log("Error when fetching pool " + pool.address);
            }

            return returnValue;
          })
        );
        setPoolsData(poolsDetails);
      } finally {
        setPoolsLoading(false);
      }
    };

    loadPoolsDetails();
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

          <TokenInformation token={token} />
        </Paper>

        <Grid container spacing={3} sx={{ mt: 3, mb: 3 }}>
          <Grid item xs={12} md={6} sx={{ mb: { xs: 2, md: 0 } }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <BridgeDisplay token={token} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} sx={{ mb: { xs: 2, md: 0 } }}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <PartnersDisplay token={token} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <LendingVenues vaultsData={vaultsData} vaultsLoading={vaultsLoading} apys={apys} />
        <Pools poolsData={poolsData} poolsLoading={poolsLoading} />
      </Container>
    </Box>
  );
};

export default L2DeploymentDetails;
