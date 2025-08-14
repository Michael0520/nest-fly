# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **NestJS learning project** implementing a restaurant management system with full-stack architecture. The application serves as a practical learning vehicle for mastering NestJS concepts through hands-on development of a real-world restaurant ordering system.

**Live Deployment:**
- Frontend: https://nest-fly-frontend.vercel.app
- Backend API: https://nest-fly-backend.vercel.app

## Architecture Overview

### Monorepo Structure
This is a pnpm workspace monorepo with domain-driven separation:
```
nest-learn/
├── apps/
│   ├── backend/          # NestJS API (Port 3001)
│   └── frontend/         # React + Vite (Port 5173)
├── packages/shared/      # Shared types and utilities
└── todolist.md          # Learning progress tracker
```

### Backend Architecture (NestJS)
- **Feature-Based Module Pattern**: Each domain has its own module (Restaurant, Config, Shared)
- **Controller-Service-Repository**: Clean 3-tier architecture with dependency injection
- **Repository Pattern**: Data access layer abstraction over Prisma ORM
- **Global Middleware**: Exception filters, response interceptors, validation pipes
- **Configuration Management**: Environment-based configuration with @nestjs/config
- **Database Layer**: PostgreSQL with Prisma ORM for type-safe operations
- **Validation**: class-validator DTOs for request/response validation
- **API Documentation**: Auto-generated Swagger from NestJS decorators

### Frontend Architecture (React)
- **Server State**: React Query for API state management with automatic caching
- **Validation**: Zod schemas for runtime type checking and API response validation
- **UI Framework**: Shadcn-UI components built on TailwindCSS v4
- **Type Safety**: End-to-end TypeScript with compile-time and runtime validation

### Core Domain Models
The restaurant domain centers around three main entities:
- **MenuItem**: Menu items with cuisine categories (JAPANESE, ITALIAN, GENERAL)
- **Order**: Customer orders with status tracking (PENDING → PREPARING → READY → SERVED)  
- **OrderItem**: Junction table connecting orders to menu items with quantities

## Essential Development Commands

### Workspace-Level Commands
```bash
# Start both applications simultaneously
pnpm dev

# Build all applications
pnpm build

# Run tests across all packages
pnpm test

# Type checking across workspace
pnpm typecheck

# Lint all code
pnpm lint

# Format all code
pnpm format
```

### Backend Development
```bash
cd apps/backend

# Development with hot reload
pnpm dev

# Build for production
pnpm build

# Testing
pnpm test              # Unit tests with Jest
pnpm test:e2e          # End-to-end tests with supertest
pnpm test:cov          # Test coverage report
pnpm test:watch        # Watch mode for tests

# Database operations
pnpm db:studio         # Open Prisma Studio (port 5556)
pnpm db:migrate        # Create new migration
pnpm db:seed           # Seed database with sample data
pnpm db:generate       # Generate Prisma client
pnpm db:reset          # Reset database and reseed
```

### Frontend Development
```bash
cd apps/frontend

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint TypeScript and React code
pnpm lint
```

### Running Individual Tests
```bash
# Backend: Run specific test file
cd apps/backend
pnpm test restaurant.service.spec.ts

# Backend: Run tests matching pattern
pnpm test --testNamePattern="should create order"

# Backend: Debug tests
pnpm test:debug
```

## Database Architecture

### Schema Overview
PostgreSQL database with three main tables:
- `menu_items`: Restaurant menu with cuisine categorization
- `orders`: Customer orders with status tracking
- `order_items`: Many-to-many relationship between orders and menu items

### Key Database Operations
```bash
# First-time setup
npx prisma migrate dev --name init

# View/edit data in browser
npx prisma studio

# Generate client after schema changes
npx prisma generate

# Reset for clean testing environment
npx prisma migrate reset
```

## API Design Patterns

### RESTful Endpoint Structure
New modular API structure following REST best practices:
- `GET /api/menu` - List menu items with optional cuisine filtering
- `GET /api/menu/:id` - Get specific menu item
- `POST /api/orders` - Create new order
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get specific order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Business analytics
- `POST /api/admin/menu/init` - Initialize sample data

### Legacy Endpoints (Deprecated)
Legacy endpoints under `/restaurant` are deprecated and will be removed:
- `GET /restaurant/menu` → Use `GET /api/menu`
- `POST /restaurant/order` → Use `POST /api/orders`
- `PATCH /restaurant/order/:id/status` → Use `PATCH /api/orders/:id/status`

### Unified Response Format
All endpoints return consistent JSON structure:
```json
{
  "success": true,
  "data": { /* Response payload */ },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/menu",
    "method": "GET",
    "version": "1.0"
  }
}
```

Error responses follow the same pattern:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "details": { /* Additional error info */ }
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "path": "/api/menu/999",
    "method": "GET",
    "correlationId": "abc123"
  }
}
```

### Request/Response Validation
Backend uses class-validator DTOs:
```typescript
export class CreateOrderDto {
  @IsString()
  customerName: string;
  
  @IsArray()
  @IsInt({ each: true })
  itemIds: number[];
}
```

Frontend uses Zod schemas for runtime validation:
```typescript
const CreateOrderSchema = z.object({
  customerName: z.string().min(1),
  itemIds: z.array(z.number())
});
```

## Key File Patterns

### Backend Critical Files (New Architecture)
- `src/modules/restaurant/restaurant.module.ts` - Main restaurant domain module
- `src/modules/restaurant/menu/controllers/menu.controller.ts` - Menu API endpoints
- `src/modules/restaurant/order/controllers/order.controller.ts` - Order API endpoints  
- `src/modules/restaurant/admin/controllers/admin.controller.ts` - Admin API endpoints
- `src/modules/restaurant/*/services/*.service.ts` - Business logic by domain
- `src/modules/restaurant/*/repositories/*.repository.ts` - Data access layer
- `src/modules/restaurant/*/dto/` - Request/response validation schemas
- `src/common/filters/http-exception.filter.ts` - Global error handling
- `src/common/interceptors/response.interceptor.ts` - Unified API responses
- `src/common/pipes/validation.pipe.ts` - Global validation
- `src/config/` - Configuration management
- `src/shared/` - Shared modules and services
- `src/prisma/prisma.service.ts` - Database connection service
- `api/index.ts` - Vercel serverless entry point

### Legacy Files (To Be Removed)
- ⚠️ `src/restaurant/` - Legacy monolithic structure (deprecated)
- ⚠️ `src/services/` - Legacy service files (partially moved to modules)
- ⚠️ `src/providers/` - Legacy provider experiments (to be integrated)

### Frontend Critical Files
- `src/api/hooks.ts` - React Query hooks for API integration
- `src/lib/schemas.ts` - Zod validation schemas
- `src/components/OrderForm.tsx` - Order creation interface
- `src/components/OrderStatusUpdater.tsx` - Status management UI

### Configuration Files
- `prisma/schema.prisma` - Database schema and relationships
- `vercel.json` (both apps) - Deployment configuration for Vercel
- `pnpm-workspace.yaml` - Monorepo workspace definition

## Environment Setup

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0  
- PostgreSQL database running locally

### Environment Variables
```bash
# Backend (.env in apps/backend)
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db"
NODE_ENV="development"

# Frontend (handled by Vite)
VITE_API_URL="http://localhost:3001"
```

### First-Time Setup
```bash
# Install dependencies
pnpm install

# Generate Prisma client
cd apps/backend && npx prisma generate

# Set up database
npx prisma migrate dev --name init
npx prisma db seed

# Start development servers
cd ../.. && pnpm dev
```

## Learning Context

This project serves as a comprehensive NestJS learning vehicle. Progress is tracked in `todolist.md` with detailed study notes in `apps/backend/note/`.

### Current Learning Status
- ✅ **NestJS Fundamentals**: Modules, Controllers, Services, Dependency Injection
- ✅ **Advanced Controllers**: DTOs, Validation, HTTP Methods, Swagger Documentation  
- ✅ **Database Integration**: Prisma ORM, Migrations, Type Safety
- ⚠️ **Providers**: Basic dependency injection (advanced patterns pending)
- 📋 **Planned**: Guards, Interceptors, Testing, Authentication

### Deployment
- **Platform**: Vercel serverless for both frontend and backend
- **CI/CD**: Automatic deployments on git push to main branch
- **Environment**: Variables managed through Vercel dashboard

## Common Development Workflows

### Adding New API Endpoint
1. Define DTO in `restaurant/dto/`
2. Add service method with business logic
3. Add controller method with HTTP decorators and validation
4. Update Swagger documentation through decorators
5. Write unit and E2E tests

### Database Schema Evolution  
1. Modify `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Update service methods if data access patterns change
4. Update seed data if new fields are required

### Frontend Feature Development
1. Define Zod schema in `lib/schemas.ts`
2. Create React Query hook in `api/hooks.ts`  
3. Build React components with TypeScript
4. Add routing if new pages are needed

## Testing Strategy

### Backend Testing
- **Unit Tests**: Jest for individual service and controller methods
- **E2E Tests**: Supertest for full HTTP request/response cycles
- **Database**: Isolated test environment with cleanup

### Frontend Testing (Planned)
- **Component Tests**: React Testing Library for UI components
- **Integration Tests**: API integration with mock services
- **E2E Tests**: Playwright for full user workflows

---

## NestJS Best Practices & Development Rules

This section defines the coding standards and architectural principles to follow when developing with NestJS in this project.

### 🏗️ Architecture Principles

#### 1. Modular Design
- **One Feature = One Module**: Each business domain should have its own module
- **Clear Boundaries**: Modules should have well-defined responsibilities
- **Loose Coupling**: Modules should depend on abstractions, not concrete implementations
- **High Cohesion**: Related functionality should be grouped together

#### 2. Layered Architecture Pattern
```
┌─────────────────┐
│   Controllers   │ ← HTTP Layer (Routing, Validation, Response)
├─────────────────┤
│    Services     │ ← Business Logic Layer
├─────────────────┤
│  Repositories   │ ← Data Access Layer  
├─────────────────┤
│     Prisma      │ ← Database ORM
└─────────────────┘
```

#### 3. Dependency Injection
- Use constructor injection for all dependencies
- Prefer interfaces over concrete classes for dependencies
- Use providers to configure complex dependencies

### 📁 Directory Structure Standards

#### Feature Module Structure
```
src/modules/[domain]/
├── [feature]/
│   ├── controllers/
│   │   └── [feature].controller.ts
│   ├── services/
│   │   └── [feature].service.ts
│   ├── repositories/
│   │   └── [feature].repository.ts
│   ├── dto/
│   │   ├── create-[feature].dto.ts
│   │   ├── update-[feature].dto.ts
│   │   └── [feature]-query.dto.ts
│   └── entities/ (if needed)
│       └── [feature].entity.ts
└── [domain].module.ts
```

#### Global Structure
```
src/
├── common/                 # Cross-cutting concerns
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Response interceptors  
│   ├── pipes/            # Validation pipes
│   ├── guards/           # Authorization guards
│   ├── decorators/       # Custom decorators
│   └── dto/              # Base DTOs
├── config/               # Configuration management
├── shared/               # Shared modules
├── modules/              # Feature modules
└── types/                # TypeScript type definitions
```

### 🎯 Controller Best Practices

#### Responsibilities
- **Handle HTTP requests and responses only**
- **Delegate business logic to services**
- **Validate incoming data using DTOs**
- **Transform responses using interceptors**

#### Standards
```typescript
@Controller('api/resource')
@ApiTags('Resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get()
  @ApiDocumentation({
    operation: 'List resources',
    success: { description: 'Resources retrieved successfully' }
  })
  async findAll(@Query() query: ResourceQueryDto) {
    return this.resourceService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const resource = await this.resourceService.findOne(id);
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    return resource;
  }
}
```

#### Rules
- ✅ Use proper HTTP status codes and methods
- ✅ Always validate input with DTOs
- ✅ Use ParseIntPipe for numeric parameters
- ✅ Throw appropriate HTTP exceptions (not return error objects)
- ✅ Add comprehensive Swagger documentation
- ❌ Don't put business logic in controllers
- ❌ Don't handle database operations directly

### 🔧 Service Best Practices

#### Responsibilities
- **Implement business logic**
- **Coordinate between multiple repositories**
- **Handle complex data transformations**
- **Manage transactions**

#### Standards
```typescript
@Injectable()
export class ResourceService {
  constructor(
    private readonly resourceRepository: ResourceRepository,
    private readonly relatedService: RelatedService,
  ) {}

  async create(createDto: CreateResourceDto): Promise<Resource> {
    // Business logic validation
    await this.validateBusinessRules(createDto);
    
    // Delegate to repository
    return this.resourceRepository.create(createDto);
  }

  private async validateBusinessRules(data: CreateResourceDto): Promise<void> {
    // Business validation logic
  }
}
```

#### Rules
- ✅ Keep services focused on single domain
- ✅ Use dependency injection for all dependencies
- ✅ Implement proper error handling
- ✅ Add comprehensive unit tests
- ❌ Don't include HTTP-specific logic
- ❌ Don't handle database connections directly

### 🗄️ Repository Best Practices

#### Responsibilities
- **Encapsulate data access logic**
- **Provide clean interface for data operations**
- **Handle database-specific concerns**
- **Map between database and domain models**

#### Standards
```typescript
@Injectable()
export class ResourceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ResourceFilters): Promise<Resource[]> {
    const items = await this.prisma.resource.findMany({
      where: this.buildWhereClause(filters),
      orderBy: { createdAt: 'desc' },
    });
    
    return items.map(item => this.mapToDomain(item));
  }

  private mapToDomain(dbItem: any): Resource {
    // Transform database model to domain model
  }

  private buildWhereClause(filters: ResourceFilters) {
    // Build dynamic where clause
  }
}
```

#### Rules
- ✅ Abstract database-specific operations
- ✅ Provide clean, domain-focused interface
- ✅ Handle data mapping between DB and domain
- ✅ Use consistent error handling
- ❌ Don't expose database implementation details
- ❌ Don't include business logic

### 📝 DTO Best Practices

#### Validation Standards
```typescript
export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource name',
    example: 'Example Resource',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @ApiProperty({
    description: 'Resource category',
    enum: ResourceCategory,
    example: ResourceCategory.PRIMARY,
  })
  @IsEnum(ResourceCategory, { 
    message: 'Category must be a valid enum value' 
  })
  category: ResourceCategory;

  @ApiProperty({
    description: 'Optional tags',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
```

#### Rules
- ✅ Use class-validator decorators for all validation
- ✅ Provide comprehensive ApiProperty documentation
- ✅ Use enums for fixed value sets
- ✅ Add custom validation messages
- ✅ Separate DTOs for different operations (Create, Update, Query)
- ❌ Don't reuse DTOs across unrelated operations

### 🛡️ Error Handling Standards

#### Global Exception Filter
All errors should be handled by the global HttpExceptionFilter which provides:
- Consistent error response format
- Request correlation IDs
- Appropriate logging levels
- Error details sanitization

#### Controller Error Handling
```typescript
// ✅ Correct way
throw new NotFoundException('Resource not found');
throw new BadRequestException('Invalid input data');
throw new ConflictException('Resource already exists');

// ❌ Incorrect way
return { success: false, message: 'Error occurred' };
```

#### Service Error Handling
```typescript
// ✅ Services should throw business exceptions
if (!resource) {
  throw new NotFoundException('Resource not found');
}

if (!this.canUserAccess(user, resource)) {
  throw new ForbiddenException('Access denied');
}
```

### 🔐 Validation & Security

#### Input Validation
- All incoming data MUST be validated using DTOs
- Use whitelist validation to strip unknown properties
- Validate nested objects and arrays
- Use transformation for type coercion

#### Security Headers
- Implement CORS properly
- Use helmet for security headers
- Validate file uploads if implemented
- Sanitize SQL inputs (handled by Prisma)

### 📊 Testing Requirements

#### Unit Tests
- Minimum 80% code coverage for services
- Test all business logic paths
- Mock external dependencies
- Use descriptive test names

#### Integration Tests
- Test complete request/response cycles
- Use test database for data operations
- Test error scenarios
- Validate response formats

#### Test Structure
```typescript
describe('ResourceService', () => {
  let service: ResourceService;
  let repository: ResourceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceService,
        { provide: ResourceRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<ResourceService>(ResourceService);
    repository = module.get<ResourceRepository>(ResourceRepository);
  });

  describe('create', () => {
    it('should create resource with valid data', async () => {
      // Test implementation
    });

    it('should throw error for invalid data', async () => {
      // Error scenario test
    });
  });
});
```

### 🚀 Performance Guidelines

#### Database Operations
- Use selective field loading (`select`)
- Implement pagination for list endpoints
- Use database indexes for frequent queries
- Avoid N+1 query problems

#### Caching Strategy
- Cache frequently accessed data
- Use appropriate cache TTL values
- Invalidate cache on data updates
- Monitor cache hit rates

### 📚 Documentation Requirements

#### Code Documentation
- Add TSDoc comments for public methods
- Document complex business logic
- Maintain README files for each module
- Keep API documentation up to date

#### Swagger Documentation
- Use ApiProperty for all DTO fields
- Add operation summaries and descriptions
- Document all response types
- Include example values

### 🔄 Migration and Cleanup Tasks

#### Immediate Actions Required
1. **Remove Legacy Code**
   - Delete `src/restaurant/` directory (old structure)
   - Remove unused files in `src/services/`
   - Clean up experimental provider code

2. **Integrate Remaining Features**
   - Move analytics service to proper module
   - Integrate cache service with repository pattern
   - Update configuration service usage

3. **Add Missing Components**
   - Implement health check endpoint
   - Add request logging middleware  
   - Create API versioning strategy
   - Add rate limiting for production

#### Code Quality Improvements
- Add comprehensive unit tests
- Implement integration test suite
- Add performance monitoring
- Create deployment health checks