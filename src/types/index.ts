export type Environment = 'L1' | 'L2';

export type Token = 'Sonic' | 'Swell';

export interface MonitoringData {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  uptime: number;
  responseTime: number;
  lastChecked: string;
  environment: Environment;
  token: Token;
}

export interface EnvironmentConfig {
  name: Environment;
  displayName: string;
  color: string;
  apiEndpoint: string;
}

export interface TokenConfig {
  name: Token;
  displayName: string;
  color: string;
  symbol: string;
}

export interface TokenEnvironmentConfig extends TokenConfig {
  l1Endpoint: string;
  l2Endpoint: string;
}

export interface DashboardMetrics {
  totalInstances: number;
  healthyInstances: number;
  warningInstances: number;
  errorInstances: number;
  offlineInstances: number;
  averageResponseTime: number;
  uptimePercentage: number;
  token: Token;
  environment: Environment;
}

export interface MockTokenInfo {
  name: string;
  L1UnderlyingTokenName: string;
  L1UnderlyingTokenAddress: string;
  L1WrappedTokenName: string;
  L1WrappedTokenAddress: string;
  L1OFTAdapterAddress: string;
  L2TokenName: string;
  L2TokenAddress: string;
  L2TokenIsOFT: boolean;
  L2ChainID: number;
  L2ChainEVM: boolean;
  BridgeUrl: string;
  wrappedTokenLogoURI: string;
  live: boolean;
  rpcUrl: string;
}

export interface TokenData {
  address: string;
  name: string;
  symbol: string;
} 