# Unified Relend Instances Monitoring Dashboard

A modern React-based monitoring dashboard for unified relend instances with environment switching capabilities between L1 and L2 environments.

## Features

- **Environment Switching**: Seamlessly switch between L1 and L2 monitoring environments
- **Real-time Metrics**: View comprehensive metrics including uptime, response times, and instance status
- **Instance Status Table**: Detailed table showing all monitored instances with their current status
- **Responsive Design**: Modern UI built with Material-UI that works on all devices
- **Auto-refresh**: Manual refresh capability with loading states
- **Error Handling**: Robust error handling with retry functionality

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for modern UI components
- **Axios** for API communication
- **Recharts** for data visualization (ready for future charts)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd unified-relend-instances-monitoring
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp env.config.example .env

# Edit the .env file with your actual API endpoints
# Update REACT_APP_L1_API_ENDPOINT and REACT_APP_L2_API_ENDPOINT
```

4. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Required: API Endpoints for different environments
REACT_APP_L1_API_ENDPOINT=http://your-l1-api-endpoint
REACT_APP_L2_API_ENDPOINT=http://your-l2-api-endpoint

# Optional: Additional configuration
REACT_APP_REFRESH_INTERVAL=30000
REACT_APP_ENABLE_AUTO_REFRESH=true
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG_MODE=true
```

**Important Notes:**
- All environment variables must start with `REACT_APP_` to be accessible in the React application
- The `.env` file should be added to `.gitignore` to keep sensitive information out of version control
- You can create different `.env` files for different environments (`.env.development`, `.env.production`, etc.)

### Environment Configuration

The dashboard is configured to work with two environments:

- **L1 Environment**: Level 1 monitoring environment
- **L2 Environment**: Level 2 monitoring environment

You can configure the API endpoints for each environment by setting environment variables:

```bash
REACT_APP_L1_API_ENDPOINT=http://your-l1-api-endpoint
REACT_APP_L2_API_ENDPOINT=http://your-l2-api-endpoint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── EnvironmentSelector.tsx
│   ├── MetricsCard.tsx
│   └── InstancesTable.tsx
├── config/             # Configuration files
│   └── environments.ts
├── services/           # API services
│   └── monitoringService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## API Integration

The dashboard is designed to work with REST APIs. The current implementation includes mock data, but you can easily integrate with real APIs by:

1. Updating the `monitoringService.ts` file
2. Uncommenting the actual API calls
3. Ensuring your API returns data in the expected format

### Expected API Response Format

#### Instances Endpoint
```json
[
  {
    "id": "string",
    "name": "string",
    "status": "healthy|warning|error|offline",
    "uptime": "number (hours)",
    "responseTime": "number (milliseconds)",
    "lastChecked": "ISO date string",
    "environment": "L1|L2"
  }
]
```

#### Metrics Endpoint
```json
{
  "totalInstances": "number",
  "healthyInstances": "number",
  "warningInstances": "number",
  "errorInstances": "number",
  "offlineInstances": "number",
  "averageResponseTime": "number (milliseconds)",
  "uptimePercentage": "number (percentage)"
}
```

## Customization

### Adding New Environments

To add new environments, update the `environments.ts` configuration file:

```typescript
export const environments: EnvironmentConfig[] = [
  // ... existing environments
  {
    name: 'L3',
    displayName: 'Level 3 Environment',
    color: '#FF5722',
    apiEndpoint: process.env.REACT_APP_L3_API_ENDPOINT || 'http://localhost:3003/api/l3'
  }
];
```

### Styling

The application uses Material-UI theming. You can customize the theme by modifying the `theme` object in `App.tsx`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.