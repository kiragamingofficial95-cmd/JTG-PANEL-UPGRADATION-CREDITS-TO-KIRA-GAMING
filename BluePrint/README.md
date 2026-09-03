# JTG Blueprint Registry

Official extension registry and marketplace for JTG Panel.

## Features

- 🔍 Extension discovery and search
- 🔑 Secure extension key generation and validation
- 📦 Extension package distribution
- 👨💻 Developer portal for publishing extensions
- 📊 Registry statistics and analytics

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The registry will be available at:
- Frontend: http://localhost:5173 (Vite dev server)
- Backend API: http://localhost:3001

### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=production
PORT=3001
REGISTRY_URL=https://blueprint.jtgpanel.com
REGISTRY_DATA_DIR=./.registry-data
```

## API Endpoints

### Public Endpoints

- `GET /api/v1/extensions` - List all extensions
- `GET /api/v1/extensions/:id` - Get extension details
- `GET /api/v1/stats` - Get registry statistics
- `POST /api/v1/keys/generate` - Generate extension key
- `POST /api/v1/keys/validate` - Validate extension key
- `POST /api/v1/keys/redeem` - Redeem extension key

### Admin Endpoints

- `POST /api/v1/extensions/publish` - Publish new extension

## Deployment

### Vercel

The registry is optimized for Vercel deployment:

1. Fork this repository
2. Connect to Vercel
3. Deploy automatically

### Docker

```bash
docker build -t jtg-blueprint-registry .
docker run -p 3001:3001 jtg-blueprint-registry
```

### Traditional Server

```bash
npm run build
NODE_ENV=production npm start
```

## Architecture

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Express + TypeScript
- **Data Storage**: File-based JSON (`.registry-data/`)

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Clean build artifacts
npm run clean
```

## License

MIT License - See LICENSE file for details

## Credits

Created by Kira Gaming for JTG Panel