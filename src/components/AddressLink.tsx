import { Link } from '@mui/material';
import React from 'react';
import { computeExplorerFromChainId } from '../utils/ChainUtils';

interface AddressLinkProps {
  address: string;
  chainId: number; // To be used with computeExplorerFromChainId to retrieve the correct explorer url
}

const AddressLink: React.FC<AddressLinkProps> = ({ address, chainId }) => {
  if (!address) return null;
  return (
    <Link
      href={`${computeExplorerFromChainId(chainId)}${address}`}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        textDecoration: 'none',
        fontFamily: 'monospace',
        fontSize: 14,
        color: '#1976d2',
        '&:hover': { textDecoration: 'underline' },
      }}
    >
      {address}
    </Link>
  );
};

export default AddressLink; 