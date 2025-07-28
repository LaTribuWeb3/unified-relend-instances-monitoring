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
    <Box sx={{ mt: { xs: 2, md: 3 } }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.125rem', md: '1.25rem' }
        }}
      >
        Token Information
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontSize: { xs: '0.875rem', md: '1rem' }
        }}
      >
        <strong>Symbol:</strong> {token.symbol}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontSize: { xs: '0.875rem', md: '1rem' }
        }}
      >
        <strong>Network:</strong> {token.network}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontSize: { xs: '0.875rem', md: '1rem' },
          wordBreak: 'break-word'
        }}
      >
        <strong>Address:</strong>{" "}
        <AddressLink address={token.address} chainId={mainnet.id} fontSize={14} />
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontSize: { xs: '0.875rem', md: '1rem' },
          wordBreak: 'break-word'
        }}
      >
        <strong>L2 Token Address:</strong>{" "}
        <AddressLink
          address={token.L2TokenAddress}
          chainId={token.L2ChainID}
          fontSize={14}
        />
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontSize: { xs: '0.875rem', md: '1rem' }
        }}
      >
        <strong>Total Supply:</strong>{" "}
        {FriendlyFormatNumber(Number(token.totalSupply))}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 1,
          fontSize: { xs: '0.875rem', md: '1rem' }
        }}
      >
        <strong>Total Supply USDC:</strong>{" "}
        {FriendlyFormatNumber(Number(token.totalSupplyUSDC))}
      </Typography>
    </Box>
  );
};

export default TokenInformation; 