import { Link } from '@mui/material';
import React from 'react';
import { computeExplorerFromChainId } from '../utils/ChainUtils';

interface AddressLinkProps {
  address: string;
  chainId: number; // To be used with computeExplorerFromChainId to retrieve the correct explorer url
  truncate?: boolean; // Optional prop to truncate the address display
  fontSize?: number; // Optional prop to customize font size
}

const AddressLink: React.FC<AddressLinkProps> = ({ 
  address, 
  chainId, 
  truncate = false,
  fontSize = 14 
}) => {
  if (!address) return null;
  
  const displayAddress = truncate 
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : address;
    
  return (
    <Link
      href={`${computeExplorerFromChainId(chainId)}${address}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        textDecoration: 'none',
        fontFamily: 'monospace',
        fontSize: fontSize,
        color: '#1976d2',
        '&:hover': { textDecoration: 'underline' },
        wordBreak: truncate ? 'normal' : 'break-all',
      }}
    >
      {displayAddress}
    </Link>
  );
};

export default AddressLink; 