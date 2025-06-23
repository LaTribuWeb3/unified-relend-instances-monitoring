# L1 Token List Viewer

A React application to display a list of L1 tokens by fetching their names directly from the blockchain.

## Features

- **Dynamic Token Loading**: Reads a list of token contract addresses from `public/mock-input.json`.
- **On-Chain Data Fetching**: Retrieves the name for each token by calling the `name()` function on its contract.
- **RPC Configuration**: Uses an RPC URL from the `.env` file to connect to an L1 chain (e.g., Ethereum).
- **Asynchronous Loading**: Displays a loading indicator while fetching data.
- **Error Handling**: Shows an error message if data fetching fails.
- **Responsive Table**: Displays the token address and its fetched name in a clean, responsive table.

## Technology Stack

- **React 18** with TypeScript
- **Ethers.js v5** for blockchain interaction
- **Material-UI (MUI)** for UI components

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd unified-relend-instances-monitoring
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root directory by copying the example file:
    ```bash
    cp env.config.example .env
    ```

    Ensure your `.env` file contains the RPC URL for the L1 network you want to query:
    ```
    REACT_APP_L1_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
    ```

4.  **Customize the token list (optional):**

    Edit the `public/mock-input.json` file to add or remove token addresses:
    ```json
    [
      {
        "L1WrappedTokenAddress": "0x..."
      },
      {
        "L1WrappedTokenAddress": "0x..."
      }
    ]
    ```

5.  Start the development server:
    ```bash
    npm start
    ```

The application will open at `http://localhost:3000`.

## Project Structure

```
public/
└── mock-input.json   # Input file with token addresses
src/
├── services/
│   └── tokenService.ts # Logic for fetching on-chain data
├── types/
│   └── index.ts        # TypeScript type definitions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
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