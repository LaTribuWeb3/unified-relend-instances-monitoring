import { EnvironmentConfig } from '../types';

export const environments: EnvironmentConfig[] = [
  {
    name: 'L1',
    displayName: 'Level 1 Environment',
    color: '#2196F3',
    apiEndpoint: process.env.REACT_APP_L1_API_ENDPOINT || 'http://localhost:3001/api/l1'
  },
  {
    name: 'L2',
    displayName: 'Level 2 Environment',
    color: '#4CAF50',
    apiEndpoint: process.env.REACT_APP_L2_API_ENDPOINT || 'http://localhost:3002/api/l2'
  }
];

export const getEnvironmentConfig = (name: string): EnvironmentConfig | undefined => {
  return environments.find(env => env.name === name);
}; 