import React from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Paper
} from '@mui/material';
import { Environment } from '../types';
import { environments } from '../config/environments';

interface EnvironmentSelectorProps {
  selectedEnvironment: Environment;
  onEnvironmentChange: (environment: Environment) => void;
}

const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  selectedEnvironment,
  onEnvironmentChange
}) => {
  const handleEnvironmentChange = (
    event: React.MouseEvent<HTMLElement>,
    newEnvironment: Environment | null
  ) => {
    if (newEnvironment !== null) {
      onEnvironmentChange(newEnvironment);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" component="h2">
          Environment Selection
        </Typography>
        <ToggleButtonGroup
          value={selectedEnvironment}
          exclusive
          onChange={handleEnvironmentChange}
          aria-label="environment selection"
        >
          {environments.map((env) => (
            <ToggleButton
              key={env.name}
              value={env.name}
              aria-label={env.name}
              sx={{
                minWidth: 120,
                '&.Mui-selected': {
                  backgroundColor: env.color,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: env.color,
                    opacity: 0.9
                  }
                }
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: env.color,
                    border: '2px solid white'
                  }}
                />
                {env.displayName}
              </Box>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
};

export default EnvironmentSelector; 