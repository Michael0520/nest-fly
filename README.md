# Restaurant Management System

A modern restaurant management system built with NestJS backend and React frontend using pnpm workspace monorepo architecture. This project demonstrates full-stack development with type-safe API integration, modern UI components, and real-time data management.

## 🚀 Features

- **Menu Management** - Browse restaurant menu with cuisine categories
- **Order Creation** - Interactive order form with item selection
- **Order Tracking** - Real-time order status updates
- **Dashboard** - Restaurant statistics and overview
- **Type Safety** - End-to-end TypeScript with runtime validation
- **Modern UI** - Beautiful interface with TailwindCSS v4 and Shadcn-UI

## 📁 Project Structure

```
nest-learn/
├── apps/
│   ├── backend/          # NestJS API server
│   │   ├── src/
│   │   │   ├── restaurant/    # Restaurant domain logic
│   │   │   ├── prisma/        # Database service
│   │   │   └── types/         # TypeScript interfaces
│   │   └── prisma/            # Database schema & migrations
│   └── frontend/         # React application
│       ├── src/
│       │   ├── api/           # API hooks & configuration
│       │   ├── components/    # UI components
│       │   ├── lib/           # Utilities & schemas
│       │   └── App.tsx        # Main application
│       └── components.json    # Shadcn-UI configuration
├── packages/
│   └── shared/           # Shared types and utilities
├── pnpm-workspace.yaml   # Workspace configuration
└── package.json          # Root package.json
```

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator with DTOs
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with supertest

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **UI Components**: Shadcn-UI
- **State Management**: React Query (TanStack Query)
- **Validation**: Zod schemas
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Icons**: Lucide React

### DevOps
- **Package Manager**: pnpm with workspaces
- **Linting**: ESLint
- **Database Migrations**: Prisma
- **CORS**: Enabled for development

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL database

### Installation

```bash
# Clone and install dependencies
pnpm install
```

### Database Setup

```bash
# Navigate to backend
cd apps/backend

# Set up database (ensure PostgreSQL is running)
npx prisma migrate dev --name init
npx prisma db seed
```

### Development

```bash
# Start backend (from apps/backend)
pnpm run start:dev

# Start frontend (from apps/frontend) 
pnpm run dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Swagger Documentation: http://localhost:3001/api

## 📋 API Endpoints

### Restaurant Management
- `GET /restaurant/menu` - Get all menu items
- `GET /restaurant/menu/:id` - Get specific menu item
- `POST /restaurant/order` - Create new order
- `GET /restaurant/orders` - Get all orders
- `GET /restaurant/order/:id` - Get specific order
- `PATCH /restaurant/order/:id/status` - Update order status
- `GET /restaurant/stats` - Get restaurant statistics

### Example API Usage

```bash
# Get menu
curl http://localhost:3001/restaurant/menu

# Create order
curl -X POST http://localhost:3001/restaurant/order \
  -H "Content-Type: application/json" \
  -d '{"customerName": "John Doe", "itemIds": [1, 2]}'

# Update order status
curl -X PATCH http://localhost:3001/restaurant/order/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "preparing"}'
```

## 🏗️ Architecture

### Frontend Architecture
- **React Query** manages server state with automatic caching and background updates
- **Zod schemas** provide runtime validation for all API responses
- **Shadcn-UI components** built on TailwindCSS v4 for consistent design
- **Type-safe API hooks** ensure compile-time and runtime safety

### Backend Architecture
- **Controller-Service-Repository pattern** with NestJS
- **Prisma ORM** for type-safe database operations
- **DTO validation** with class-validator for request validation
- **Swagger documentation** auto-generated from decorators

## 📱 Application Pages

1. **Dashboard** (`/`) - Restaurant statistics and quick actions
2. **Menu** (`/menu`) - Display all menu items with cuisine categories  
3. **Orders** (`/orders`) - Manage orders with status updates
4. **Create Order** (`/create-order`) - Interactive order creation form

## 🔧 Development Commands

```bash
# Backend development
cd apps/backend
pnpm run start:dev     # Start with hot reload
pnpm run build        # Build for production
pnpm run test          # Run tests

# Frontend development  
cd apps/frontend
pnpm run dev           # Start dev server
pnpm run build         # Build for production
pnpm run lint          # Lint code

# Database operations
cd apps/backend
npx prisma studio      # Open Prisma Studio
npx prisma migrate dev # Create migration
npx prisma db seed     # Seed database
```

## 🎯 Learning Goals

This project demonstrates:
- Modern full-stack development patterns
- Type-safe API integration
- Real-time data management
- Component-based UI architecture
- Database modeling and migrations
- API documentation with Swagger
- Monorepo workspace management

## 📝 License

MIT
