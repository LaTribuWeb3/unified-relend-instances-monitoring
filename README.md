# Unified Relend Instances Monitoring Dashboard

A modern React TypeScript dashboard for monitoring unified relend instances with environment switching capabilities.

## 🚀 Features

- **Real-time Monitoring**: Track relend instances across different environments
- **Environment Switching**: Seamlessly switch between L1 and L2 environments
- **Modern UI**: Built with Material-UI for a professional look and feel
- **TypeScript**: Full type safety throughout the application
- **Fast Development**: Powered by Vite for lightning-fast builds and hot reload

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Material-UI** - Professional UI components
- **Viem** - Ethereum interaction library
- **React Router** - Client-side routing
- **Recharts** - Data visualization

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/LaTribuWeb3/unified-relend-instances-monitoring.git
cd unified-relend-instances-monitoring
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.config.example .env
```

Edit the `.env` file with your configuration:
```env
VITE_L1_RPC_URL=your_l1_rpc_url_here
VITE_L1_API_ENDPOINT=http://localhost:3001/api/l1
VITE_L2_API_ENDPOINT=http://localhost:3002/api/l2
VITE_REFRESH_INTERVAL=30000
VITE_ENABLE_AUTO_REFRESH=true
VITE_ENVIRONMENT=development
VITE_DEBUG_MODE=true
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AddressLink.tsx
│   ├── TokenDetail.tsx
│   └── tradelinks/
├── config/             # Configuration files
├── services/           # API and data services
│   └── tokenData/
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main application component
└── index.tsx           # Application entry point
```

## 🔧 Configuration

The application supports multiple environments through environment variables:

- `VITE_L1_RPC_URL`: Ethereum L1 RPC endpoint
- `VITE_L1_API_ENDPOINT`: L1 API endpoint
- `VITE_L2_API_ENDPOINT`: L2 API endpoint
- `VITE_REFRESH_INTERVAL`: Data refresh interval in milliseconds
- `VITE_ENABLE_AUTO_REFRESH`: Enable/disable auto-refresh
- `VITE_ENVIRONMENT`: Current environment (development/production)
- `VITE_DEBUG_MODE`: Enable debug logging

## 🚀 Deployment

### CloudFlare Pages

This project is optimized for CloudFlare Pages deployment. The build process is configured to work seamlessly with CloudFlare's build system.

Build settings for CloudFlare Pages:
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: 18 or higher

### Other Platforms

The application can be deployed to any static hosting platform:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Relend Network](https://relend.network)
- [Material-UI Documentation](https://mui.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Viem Documentation](https://viem.sh/)