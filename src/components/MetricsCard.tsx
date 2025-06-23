import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { DashboardMetrics } from '../types';

interface MetricsCardProps {
  metrics: DashboardMetrics;
  environment: string;
}

const MetricsCard = (props: MetricsCardProps) => {
  const { metrics, environment } = props;
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {environment} Environment Metrics
        </Typography>
        
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Instances
            </Typography>
            <Typography variant="h4" component="div">
              {metrics.totalInstances}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="body2" color="text.secondary">
              Uptime
            </Typography>
            <Typography variant="h4" component="div">
              {metrics.uptimePercentage.toFixed(1)}%
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          <Chip
            label={`Healthy: ${metrics.healthyInstances}`}
            size="small"
            sx={{ backgroundColor: '#4CAF50', color: 'white' }}
          />
          <Chip
            label={`Warning: ${metrics.warningInstances}`}
            size="small"
            sx={{ backgroundColor: '#FF9800', color: 'white' }}
          />
          <Chip
            label={`Error: ${metrics.errorInstances}`}
            size="small"
            sx={{ backgroundColor: '#F44336', color: 'white' }}
          />
          <Chip
            label={`Offline: ${metrics.offlineInstances}`}
            size="small"
            sx={{ backgroundColor: '#9E9E9E', color: 'white' }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Average Response Time
          </Typography>
          <Typography variant="h6" component="div">
            {metrics.averageResponseTime.toFixed(2)}ms
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricsCard; 