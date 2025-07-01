import { Box, Typography } from "@mui/material";
import { mainnet } from "viem/chains";
import { TokenData } from "@/types";
import { FriendlyFormatNumber } from "@/utils/DisplayUtils";
import AddressLink from "../AddressLink";

interface TokenInformationProps {
  token: TokenData;
}

const TokenInformation = ({ token }: TokenInformationProps) => {
  return (
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
        <strong>Total Supply:</strong>{" "}
        {FriendlyFormatNumber(Number(token.totalSupply))}
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        <strong>Total Supply USDC:</strong>{" "}
        {FriendlyFormatNumber(Number(token.totalSupplyUSDC))}
      </Typography>
    </Box>
  );
};

export default TokenInformation; 