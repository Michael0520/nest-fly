# NestJS TodoList CRUD 專案指南

## 專案目的
建立一個完整的 TodoList 後端 API 服務，使用 NestJS 框架實作 RESTful API，提供待辦事項的新增、查詢、修改、刪除功能。

## 專案期望
1. **學習 NestJS 核心概念**：模組化架構、依賴注入、裝飾器模式
2. **實作完整 CRUD 功能**：Create、Read、Update、Delete 操作
3. **遵循最佳實踐**：程式碼結構清晰、可維護性高、符合 SOLID 原則
4. **資料驗證與錯誤處理**：確保 API 的穩定性與安全性

## 技術架構

### 核心技術
- **NestJS**: 企業級 Node.js 框架
- **TypeScript**: 提供型別安全
- **TypeORM**: 物件關聯映射（ORM）
- **SQLite/PostgreSQL**: 資料庫
- **Class-validator**: DTO 驗證
- **Class-transformer**: 資料轉換

## 專案結構（Best Practice）

```
src/
├── app.module.ts           # 根模組
├── main.ts                 # 應用程式入口
├── common/                 # 共用元件
│   ├── filters/           # 例外過濾器
│   ├── interceptors/      # 攔截器
│   └── pipes/             # 管道
├── config/                 # 設定檔
│   └── database.config.ts
├── todos/                  # Todo 功能模組
│   ├── todos.module.ts    # Todo 模組
│   ├── todos.controller.ts # 控制器（處理 HTTP 請求）
│   ├── todos.service.ts    # 服務層（業務邏輯）
│   ├── dto/               # 資料傳輸物件
│   │   ├── create-todo.dto.ts
│   │   └── update-todo.dto.ts
│   ├── entities/          # 實體定義
│   │   └── todo.entity.ts
│   └── interfaces/        # 介面定義
│       └── todo.interface.ts
└── database/               # 資料庫相關
    └── database.module.ts
```

## 開發步驟

### 步驟 1: 初始化專案
```bash
# 安裝 NestJS CLI
npm i -g @nestjs/cli

# 建立新專案
nest new todolist-api

# 進入專案目錄
cd todolist-api

# 安裝額外依賴
npm install @nestjs/typeorm typeorm sqlite3
npm install class-validator class-transformer
npm install @nestjs/mapped-types
```

### 步驟 2: 建立 Todo 模組
```bash
# 使用 CLI 產生模組、控制器、服務
nest g module todos
nest g controller todos
nest g service todos
```

### 步驟 3: 定義資料結構

#### Todo Entity (entities/todo.entity.ts)
```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 步驟 4: 建立 DTO（資料傳輸物件）

#### Create Todo DTO
```typescript
import { IsString, IsOptional, IsBoolean, IsDateString, MinLength, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
```

#### Update Todo DTO
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

### 步驟 5: 實作服務層

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepository.create(createTodoDto);
    return await this.todosRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return await this.todosRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todosRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todosRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const result = await this.todosRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }
}
```

### 步驟 6: 實作控制器

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
```

### 步驟 7: 設定資料庫連接

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'todolist.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 生產環境請設為 false
    }),
    TodosModule,
  ],
})
export class AppModule {}
```

## API 端點規格

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | /todos | 取得所有待辦事項 | - | Todo[] |
| GET | /todos/:id | 取得單一待辦事項 | - | Todo |
| POST | /todos | 新增待辦事項 | CreateTodoDto | Todo |
| PATCH | /todos/:id | 更新待辦事項 | UpdateTodoDto | Todo |
| DELETE | /todos/:id | 刪除待辦事項 | - | 204 No Content |

## 測試 API

### 使用 HTTPie 或 Postman 測試

```bash
# 新增 Todo
http POST localhost:3000/todos title="學習 NestJS" description="完成 CRUD 專案"

# 取得所有 Todos
http GET localhost:3000/todos

# 取得單一 Todo
http GET localhost:3000/todos/{id}

# 更新 Todo
http PATCH localhost:3000/todos/{id} completed=true

# 刪除 Todo
http DELETE localhost:3000/todos/{id}
```

## 進階功能建議

1. **分頁功能**: 實作 pagination
2. **搜尋過濾**: 根據標題、狀態篩選
3. **排序功能**: 依日期、優先級排序
4. **使用者認證**: JWT 認證機制
5. **API 文件**: 整合 Swagger
6. **單元測試**: Jest 測試框架
7. **Docker 容器化**: 建立 Dockerfile
8. **環境變數管理**: 使用 @nestjs/config

## 最佳實踐重點

1. **關注點分離**: Controller 處理 HTTP、Service 處理業務邏輯
2. **依賴注入**: 使用 NestJS 的 DI 容器管理依賴
3. **錯誤處理**: 使用適當的 HTTP 狀態碼和例外處理
4. **資料驗證**: 使用 ValidationPipe 驗證輸入
5. **型別安全**: 充分利用 TypeScript 的型別系統
6. **模組化設計**: 每個功能獨立模組，提高可維護性

## 學習資源

- [NestJS 官方文件](https://docs.nestjs.com/)
- [TypeORM 文件](https://typeorm.io/)
- [REST API 設計指南](https://restfulapi.net/)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)

## 下一步

完成基本 CRUD 後，可以考慮：
1. 加入使用者系統
2. 實作標籤功能
3. 加入優先級管理
4. 整合前端框架（React/Vue/Angular）
5. 部署到雲端平台（Heroku/AWS/GCP）