import { TokenData } from "@/types";
import DexDisplay from "../dex/DexDisplay";
import { Typography } from "@mui/material";
import { Launch as LaunchIcon } from "@mui/icons-material";

interface PartnersDisplayProps {
  token: TokenData;
}

const PartnersDisplay = ({ token }: PartnersDisplayProps) => {
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
        Partners
      </Typography>
      <DexDisplay token={token} />
    </>
  );
};

export default PartnersDisplay;
