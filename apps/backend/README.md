# 🍽️ International Restaurant API

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A NestJS learning project that implements a restaurant management system with complete API documentation and testing.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/>
  </a>
</p>

## 🎯 Project Overview

This project is a practical implementation of NestJS concepts, featuring:

- **Restaurant Management System**: Menu items, orders, and statistics (in-memory storage)
- **RESTful API**: Complete CRUD operations for restaurant operations
- **Swagger Documentation**: Interactive API documentation with testing interface
- **Full Test Coverage**: Unit tests and E2E tests with 100% pass rate
- **Type Safety**: TypeScript with strict typing and validation using class-validator

> **💡 Note**: This is a Day 01 learning project using in-memory data storage. Data will reset when the application restarts.

## ✨ Key Features

### 🍜 Menu Management
- View complete restaurant menu with different cuisines
- Support for Japanese, Italian, and General cuisine types
- Individual menu item details with pricing

### 📋 Order System
- Create customer orders with multiple items
- Real-time order status tracking (pending → preparing → ready → served)
- Order history and management

### 📊 Statistics Dashboard
- Restaurant operation metrics
- Total orders and revenue tracking
- Menu performance analytics

### 📚 API Documentation
- Interactive Swagger UI for endpoint testing
- Complete request/response schemas
- Built-in validation and error handling

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start in development mode with hot reload
pnpm run start:dev

# Start in production mode
pnpm run start:prod
```

### Testing

```bash
# Run unit tests
pnpm run test

# Run E2E tests
pnpm run test:e2e

# Generate test coverage report
pnpm run test:cov

# Run linting
pnpm run lint
```

## 📡 API Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/` | Welcome message and available routes | ✅ |
| `GET` | `/restaurant/menu` | Get complete restaurant menu | ✅ |
| `GET` | `/restaurant/menu/:id` | Get specific menu item details | ✅ |
| `POST` | `/restaurant/order` | Create new customer order | ✅ |
| `GET` | `/restaurant/orders` | Retrieve all orders | ✅ |
| `GET` | `/restaurant/order/:id` | Get specific order details | ✅ |
| `PATCH` | `/restaurant/order/:id/status` | Update order status | ✅ |
| `GET` | `/restaurant/stats` | Get restaurant operation statistics | ✅ |

## 🌐 Live Demo

Once the application is running, you can access:

- **🏠 Main Application**: [http://localhost:3001](http://localhost:3001)
- **📖 Swagger API Documentation**: [http://localhost:3001/api](http://localhost:3001/api)

## 🏗️ Project Structure

```
src/
├── app.module.ts                    # Main application module
├── app.controller.ts                # Welcome page controller
├── app.service.ts                   # Application service
├── main.ts                         # Application entry point with Swagger setup
├── restaurant/                     # Restaurant feature module
│   ├── restaurant.module.ts        # Restaurant module definition
│   ├── restaurant.controller.ts    # API endpoints and request handling
│   ├── restaurant.service.ts       # Business logic and data management
│   ├── *.spec.ts                   # Unit test files
│   └── dto/                        # Data Transfer Objects
│       ├── create-order.dto.ts     # Order creation validation
│       ├── update-order-status.dto.ts # Order status update validation
│       ├── menu-response.dto.ts    # Menu response schema
│       └── order-response.dto.ts   # Order response schema
├── types/
│   └── menu.interface.ts           # TypeScript interfaces for data models
└── test/                          # End-to-end test files
```

## 🧪 Testing Results

- ✅ **Unit Tests**: 11/11 passing
- ✅ **E2E Tests**: 5/5 passing
- ✅ **ESLint**: No errors or warnings
- ✅ **Type Checking**: Strict TypeScript compliance

## 🔮 Roadmap & Future Improvements

### Phase 2 (Database Integration)

- [ ] **PostgreSQL Integration**: Persistent data storage with TypeORM
- [ ] **Database Migrations**: Schema versioning and updates
- [ ] **Connection Pooling**: Optimized database performance

### Phase 3 (Authentication & Security)

- [ ] **JWT Authentication**: Secure user login system
- [ ] **Role-Based Authorization**: Admin, staff, and customer roles
- [ ] **API Rate Limiting**: Request throttling and abuse prevention

### Phase 4 (Advanced Features)

- [ ] **Real-time Updates**: WebSocket integration for live order status
- [ ] **File Upload**: Menu item image management
- [ ] **Caching Layer**: Redis integration for improved performance
- [ ] **Email Notifications**: Order confirmation and status updates

### Phase 5 (DevOps & Production)

- [ ] **Docker Containerization**: Easy deployment and scaling
- [ ] **CI/CD Pipeline**: Automated testing and deployment
- [ ] **Monitoring & Logging**: Application performance insights
- [ ] **Health Checks**: Service availability monitoring

## 📚 Learning Objectives Achieved

This project demonstrates mastery of:

### Core NestJS Concepts

- ✅ **Module System**: Organized code structure with feature modules
- ✅ **Dependency Injection**: Service-based architecture
- ✅ **Decorators**: Controller and service decorators usage
- ✅ **HTTP Methods**: RESTful API implementation

### Advanced Features

- ✅ **Data Validation**: DTO classes with class-validator
- ✅ **API Documentation**: Swagger integration with decorators
- ✅ **Testing Strategy**: Unit and E2E test coverage
- ✅ **Error Handling**: Proper HTTP status codes and responses

### Development Best Practices

- ✅ **TypeScript**: Strict typing and interface definitions
- ✅ **Code Quality**: ESLint configuration and formatting
- ✅ **Documentation**: Comprehensive README and inline comments
- ✅ **Version Control**: Structured commit history

## 📖 Learning Timeline

- **✅ Day 01**: Basic NestJS setup with in-memory data storage
- **🔄 Day 02**: Database integration (PostgreSQL + TypeORM)
- **🔄 Day 03**: Authentication & authorization implementation
- **🔄 Day 04**: Advanced features and production optimization

## 🤝 Contributing

This is a learning project, but contributions and suggestions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed descriptions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS Team](https://nestjs.com/) for the amazing framework
- [Swagger/OpenAPI](https://swagger.io/) for API documentation tools
- The TypeScript and Node.js communities

---

**🚀 Happy Learning with NestJS!** 

For questions or feedback, feel free to open an issue or reach out through the repository discussions.