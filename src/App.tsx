import { Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

import EnvironmentSelector from './components/EnvironmentSelector';
import InstancesTable from './components/InstancesTable';
import MetricsCard from './components/MetricsCard';
import { monitoringService } from './services/monitoringService';
import { DashboardMetrics, Environment, MonitoringData } from './types';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [selectedEnvironment, setSelectedEnvironment] = React.useState<Environment>('L1');
  const [instances, setInstances] = React.useState<MonitoringData[]>([]);
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadData = async (environment: Environment) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await monitoringService.refreshData(environment);
      setInstances(data.instances);
      setMetrics(data.metrics);
    } catch (err) {
      setError('Failed to load monitoring data. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnvironmentChange = (environment: Environment) => {
    setSelectedEnvironment(environment);
    loadData(environment);
  };

  const handleRefresh = () => {
    loadData(selectedEnvironment);
  };

  React.useEffect(() => {
    loadData(selectedEnvironment);
  }, [selectedEnvironment]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Unified Relend Instances Monitoring
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleRefresh}
              disabled={loading}
              aria-label="refresh data"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          <EnvironmentSelector
            selectedEnvironment={selectedEnvironment}
            onEnvironmentChange={handleEnvironmentChange}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
              <Button
                color="inherit"
                size="small"
                onClick={handleRefresh}
                sx={{ ml: 2 }}
              >
                Retry
              </Button>
            </Alert>
          )}

          {loading && !instances.length ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {metrics && (
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <MetricsCard metrics={metrics} environment={selectedEnvironment} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.paper',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Additional charts and visualizations can be added here
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              )}

              {instances.length > 0 && (
                <InstancesTable instances={instances} />
              )}
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 