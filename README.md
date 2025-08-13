# Restaurant Management System

A learning project built with NestJS and React using pnpm workspace monorepo architecture.

## Project Structure

```
nest-learn/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # React application
├── packages/
│   └── shared/           # Shared types and utilities
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root package.json
```

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database

### Installation

```bash
pnpm install
```

### Environment Setup

1. **Backend configuration**
   ```bash
   cd apps/backend
   cp .env.example .env
   # Edit .env file with your database connection details
   ```

2. **Frontend configuration**
   ```bash
   cd apps/frontend
   cp .env.example .env
   # Default API URL is http://localhost:3001
   ```

### Database Setup

```bash
# Run database migrations
pnpm db:migrate

# Seed sample data
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## Development Commands

### Start both backend and frontend

```bash
pnpm dev
```

### Start services individually

```bash
# Backend only
pnpm backend:dev

# Frontend only
pnpm frontend:dev
```

### Build

```bash
# Build all projects
pnpm build

# Build individually
pnpm backend:build
pnpm frontend:build
```

### Other Commands

```bash
# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Clean all dependencies
pnpm clean
```

## API Endpoints

### Menu Management
- `GET /restaurant/menu` - Get menu items
- `POST /restaurant/orders` - Create new order
- `GET /restaurant/orders` - Get all orders
- `PATCH /restaurant/orders/:id/status` - Update order status

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Documentation**: Swagger
- **Testing**: Jest

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios

### Shared
- **Language**: TypeScript
- **Content**: Type definitions and interfaces

## License

MIT