import React from 'react';
import { Link } from '@mui/material';

interface AddressLinkProps {
  address: string;
  explorerBaseUrl: string; // e.g. https://etherscan.io/address/
}

const AddressLink: React.FC<AddressLinkProps> = ({ address, explorerBaseUrl }) => {
  if (!address) return null;
  return (
    <Link
      href={`${explorerBaseUrl}${address}`}
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