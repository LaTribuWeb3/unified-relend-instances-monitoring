export type Environment = 'L1' | 'L2';

export interface MonitoringData {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  environment: Environment;
}

export interface EnvironmentConfig {
  name: Environment;
  displayName: string;
  color: string;
  apiEndpoint: string;
}

export interface DashboardMetrics {
  totalInstances: number;
  healthyInstances: number;
  warningInstances: number;
  errorInstances: number;
  offlineInstances: number;
  averageResponseTime: number;
  uptimePercentage: number;
} 