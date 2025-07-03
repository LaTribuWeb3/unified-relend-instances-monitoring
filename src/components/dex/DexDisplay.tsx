import { Box, Typography } from "@mui/material";
import { TokenData } from "@/types";
import * as chains from "viem/chains";
import { Chain } from "viem";

function getChain(id: number) {
  return Object.values(chains).find((chain: Chain) => chain.id === id);
}

const DexDisplay = ({ token }: { token: TokenData }) => {
  const networkName = getChain(token.L2ChainID)?.name;

  console.log("DexDisplay - token.pools:", token.pools);
  console.log("DexDisplay - networkName:", networkName);

  if (!networkName) {
    console.log("No network found for chain ID: " + token.L2ChainID);
    return null;
  }

  if (!token.pools || token.pools.length === 0) {
    console.log("No pools found for token");
    return null;
  }

  return (
    <>
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 3, 
        py: 2,
        px: 1
      }}>
        {token.pools.map((pool, index) => {
          console.log("Pool:", pool);
          if (pool.type === "Velodrome") {
            return (
              <a 
                key={index}
                href={`https://velodrome.finance/liquidity?filters=${networkName}&query=${pool.address}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  cursor: "pointer",
                  margin: 0,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.backgroundColor = "#f1f3f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
                title="View on Velodrome Finance"
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <img 
                    src="/velodrome_logo_only.svg" 
                    alt="Velodrome Finance" 
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "block",
                      margin: 0,
                      padding: 0
                    }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Velodrome
                  </Typography>
                </Box>
              </a>
            );
          }
          return null; // Important: return null for non-matching pools
        })}
        {token.lending.map((lending: { type: string; address: string }, index: number) => {
          if (lending.type === "Euler") {
            return (
              <a 
                key={index}
                href={`https://app.euler.finance/vault/${lending.address}?network=${networkName}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  cursor: "pointer",
                  margin: 0,
                  padding: "12px 16px",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                  border: "1px solid #e9ecef"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.backgroundColor = "#f1f3f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
                title="View on Euler Finance"
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <img 
                    src="/euler_logo_only.svg" 
                    alt="Euler Finance" 
                    style={{ 
                      width: "28px", 
                      height: "28px", 
                      display: "block", 
                      margin: 0, 
                      padding: 0 
                    }} 
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Euler
                  </Typography>
                </Box>
              </a>
            );
          }
          return null; // Important: return null for non-matching pools
        })}
      </Box>
    </>
  );
};

export default DexDisplay;
