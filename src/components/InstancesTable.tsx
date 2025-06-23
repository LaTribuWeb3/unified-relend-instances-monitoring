import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { MonitoringData } from '../types';

interface InstancesTableProps {
  instances: MonitoringData[];
}

const InstancesTable: React.FC<InstancesTableProps> = ({ instances }) => {
  const getStatusChip = (status: string) => {
    const statusConfig = {
      healthy: { color: '#4CAF50', label: 'Healthy' },
      warning: { color: '#FF9800', label: 'Warning' },
      error: { color: '#F44336', label: 'Error' },
      offline: { color: '#9E9E9E', label: 'Offline' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.offline;

    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.color,
          color: 'white',
          fontWeight: 'bold'
        }}
      />
    );
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 24);
    const hours = uptime % 24;
    return `${days}d ${hours}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Paper elevation={2}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h3">
          Instance Status ({instances.length} instances)
        </Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instance Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uptime</TableCell>
              <TableCell>Response Time</TableCell>
              <TableCell>Last Checked</TableCell>
              <TableCell>Environment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instances.map((instance) => (
              <TableRow key={instance.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {instance.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {getStatusChip(instance.status)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatUptime(instance.uptime)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {instance.responseTime.toFixed(2)}ms
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(instance.lastChecked)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={instance.environment}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default InstancesTable; 