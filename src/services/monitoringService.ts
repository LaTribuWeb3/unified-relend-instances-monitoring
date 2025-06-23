import { MonitoringData, DashboardMetrics, Environment } from '../types';
import { getEnvironmentConfig } from '../config/environments';

// Mock data for demonstration purposes
const mockInstances: MonitoringData[] = [
  {
    id: '1',
    name: 'Web Server 1',
    status: 'healthy',
    uptime: 168,
    responseTime: 45.2,
    lastChecked: new Date().toISOString(),
    environment: 'L1'
  },
  {
    id: '2',
    name: 'Database Server 1',
    status: 'warning',
    uptime: 72,
    responseTime: 120.5,
    lastChecked: new Date().toISOString(),
    environment: 'L1'
  },
  {
    id: '3',
    name: 'Load Balancer 1',
    status: 'healthy',
    uptime: 240,
    responseTime: 12.8,
    lastChecked: new Date().toISOString(),
    environment: 'L1'
  },
  {
    id: '4',
    name: 'Web Server 2',
    status: 'error',
    uptime: 0,
    responseTime: 0,
    lastChecked: new Date().toISOString(),
    environment: 'L2'
  },
  {
    id: '5',
    name: 'Database Server 2',
    status: 'healthy',
    uptime: 192,
    responseTime: 89.3,
    lastChecked: new Date().toISOString(),
    environment: 'L2'
  },
  {
    id: '6',
    name: 'Cache Server 1',
    status: 'offline',
    uptime: 0,
    responseTime: 0,
    lastChecked: new Date().toISOString(),
    environment: 'L2'
  }
];

const mockMetrics: Record<Environment, DashboardMetrics> = {
  L1: {
    totalInstances: 3,
    healthyInstances: 2,
    warningInstances: 1,
    errorInstances: 0,
    offlineInstances: 0,
    averageResponseTime: 59.5,
    uptimePercentage: 93.3
  },
  L2: {
    totalInstances: 3,
    healthyInstances: 1,
    warningInstances: 0,
    errorInstances: 1,
    offlineInstances: 1,
    averageResponseTime: 29.8,
    uptimePercentage: 33.3
  }
};

export const monitoringService = {
  async getInstances(environment: Environment): Promise<MonitoringData[]> {
    try {
      const config = getEnvironmentConfig(environment);
      if (!config) {
        throw new Error(`Environment ${environment} not found`);
      }

      // In a real application, this would be an actual API call
      // const response = await axios.get(`${config.apiEndpoint}/instances`);
      // return response.data;

      // For now, return mock data filtered by environment
      return mockInstances.filter(instance => instance.environment === environment);
    } catch (error) {
      console.error('Error fetching instances:', error);
      throw error;
    }
  },

  async getMetrics(environment: Environment): Promise<DashboardMetrics> {
    try {
      const config = getEnvironmentConfig(environment);
      if (!config) {
        throw new Error(`Environment ${environment} not found`);
      }

      // In a real application, this would be an actual API call
      // const response = await axios.get(`${config.apiEndpoint}/metrics`);
      // return response.data;

      // For now, return mock metrics
      return mockMetrics[environment];
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  async refreshData(environment: Environment): Promise<{
    instances: MonitoringData[];
    metrics: DashboardMetrics;
  }> {
    try {
      const [instances, metrics] = await Promise.all([
        this.getInstances(environment),
        this.getMetrics(environment)
      ]);

      return { instances, metrics };
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }
}; 