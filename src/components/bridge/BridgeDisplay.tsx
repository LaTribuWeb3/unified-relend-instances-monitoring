import { Box, Link, Typography } from "@mui/material";
import { TokenData } from "@/types";
import { Launch as LaunchIcon } from "@mui/icons-material";

interface BridgeDisplayProps {
  token: TokenData;
}

const BridgeDisplay = ({ token }: BridgeDisplayProps) => {
  return (
    <>
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
    </>
  );
};

export default BridgeDisplay; 