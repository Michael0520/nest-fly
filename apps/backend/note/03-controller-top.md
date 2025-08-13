# NestJS Controller 深入解析 (上)

## 📝 前言

在 NestJS 的架構中，**Controller** 扮演著路由配置和處理客戶端請求的核心角色。每個 Controller 都可以依據需求設計不同的 HTTP Method 資源，就像餐廳的外場服務生負責帶位、協助客人點餐，並根據客戶的需求做出相對應的回應。

> **🍽️ 餐廳比喻**: Controller 就像餐廳的外場服務生，負責接待客人、處理點餐需求，並將客人的要求傳達給後廚（Service）。

## 🎯 什麼是 Controller

**Controller** 是一個處理客戶端請求，並將相同性質的資源整合在一起的核心元件。它的主要職責包括：

- 🔗 **路由管理**: 定義 API 端點和路由規則
- 📥 **請求處理**: 接收並解析客戶端請求
- 📤 **回應生成**: 處理業務邏輯並返回適當的回應
- 🗂️ **資源整合**: 將相關的 API 端點組織在一起

## 🏗️ 建置 Controller

### 使用 NestJS CLI 快速生成

所有的 Controller 都必須使用 `@Controller` 裝飾器來定義。最簡單的方式是使用 NestJS CLI：

```bash
# 基本語法
nest generate controller <CONTROLLER_NAME>

# 實際範例
nest generate controller todo
```

> **💡 進階技巧**: `<CONTROLLER_NAME>` 可以包含路徑，例如：`features/todo`，這樣會在 `src` 資料夾下建立對應的路徑結構。

### 生成結果

執行命令後，會在 `src` 目錄下看到：

```
src/
└── todo/
    ├── todo.controller.ts      # Controller 主檔案
    └── todo.controller.spec.ts # 測試檔案
```

### 自動模組註冊

NestJS CLI 會自動將新建的 Controller 註冊到 AppModule 中：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoController } from './todo/todo.controller';

@Module({
  imports: [],
  controllers: [AppController, TodoController], // 自動新增
  providers: [AppService],
})
export class AppModule {}
```

## 🛣️ 路由系統

### 路由前綴 (Route Prefix)

生成的 Controller 會自動設定路由前綴：

```typescript
import { Controller } from '@nestjs/common';

@Controller('todo') // 路由前綴
export class TodoController {}
```

> **📝 命名慣例**: 通常 Controller 類別名稱使用單數（如 `TodoController`），而路由前綴使用複數（如 `todos`）。

### 路由前綴的優勢

使用路由前綴可以將相同性質的資源整合在同一個 Controller 中：

```
📁 TodoController ('todos')
├── GET    /todos          # 獲取所有待辦事項
├── POST   /todos          # 創建新待辦事項
├── GET    /todos/:id      # 獲取特定待辦事項
├── PUT    /todos/:id      # 更新特定待辦事項
└── DELETE /todos/:id      # 刪除特定待辦事項
```

## 🌐 HTTP Methods

### 基本用法

透過 HTTP Method 裝飾器可以輕鬆配置對應的資源：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get() // 處理 GET /todos
  getAll() {
    return [];
  }
}
```

**測試結果**: 瀏覽器訪問 `http://localhost:3000/todos` 會返回空陣列。

### 完整的 HTTP Methods 列表

NestJS 支援所有標準 HTTP Methods：

| 裝飾器 | HTTP Method | 用途說明 | 使用場景 |
|--------|-------------|----------|----------|
| `@Get` | GET | 獲取資源 | 查詢資料、列表顯示 |
| `@Post` | POST | 創建資源 | 新增資料、表單提交 |
| `@Put` | PUT | 完整更新資源 | 替換整個資源 |
| `@Patch` | PATCH | 部分更新資源 | 修改部分欄位 |
| `@Delete` | DELETE | 刪除資源 | 移除資料 |
| `@Options` | OPTIONS | 預檢請求 | CORS 支援 |
| `@Head` | HEAD | 僅獲取標頭 | 檢查資源是否存在 |
| `@All` | 全部 | 接受任何方法 | 特殊處理需求 |

## 🌳 子路由設計

### 基本子路由

不需要為每個子路由建立新的 Controller，可以在 HTTP Method 裝飾器中指定：

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get('examples') // 處理 GET /todos/examples
  getExamples() {
    return [
      {
        id: 1,
        title: 'Example 1',
        description: 'This is an example todo item'
      }
    ];
  }
}
```

### 路由設計最佳實踐

```typescript
@Controller('todos')
export class TodoController {
  @Get()           // GET /todos - 獲取待辦清單
  @Get('examples') // GET /todos/examples - 獲取範例資料
  @Get('stats')    // GET /todos/stats - 獲取統計資訊
  @Get(':id')      // GET /todos/:id - 獲取特定待辦事項
}
```

## 🔍 通用路由符號 (Wildcards)

### 使用 `*` 符號

可以使用 `*` 提供路由的容錯空間：

```typescript
@Controller('todos')
export class TodoController {
  @Get('exam*ples') // 可匹配多種變化
  getFlexibleRoute() {
    return [
      {
        id: 1,
        title: 'Flexible Example',
        description: 'This route accepts various patterns'
      }
    ];
  }
}
```

**匹配範例**:
- ✅ `/todos/examples`
- ✅ `/todos/exammmples` 
- ✅ `/todos/exam_ples`
- ✅ `/todos/exam123ples`

> **⚠️ 注意事項**: 除了 `?` 以外，大多數字元都被允許，但使用時需要謹慎考慮安全性和可維護性。

## 📮 路由參數 (Path Parameters)

### 基本用法

路由參數讓 API 更加靈活和動態：

```typescript
import { Controller, Get, Param } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get(':id') // 路由參數定義
  getTodoById(@Param() params: { id: string }) {
    const { id } = params;
    return {
      id,
      title: `Todo Item ${id}`,
      description: 'This is a dynamic todo item'
    };
  }
}
```

### 簡化參數獲取

可以直接指定參數名稱，使程式碼更簡潔：

```typescript
@Controller('todos')
export class TodoController {
  @Get(':id')
  getTodoById(@Param('id') id: string) {
    return {
      id,
      title: `Todo Item ${id}`,
      description: 'Simplified parameter access'
    };
  }
}
```

### 多重路由參數

```typescript
@Get('users/:userId/todos/:todoId')
getUserTodo(
  @Param('userId') userId: string,
  @Param('todoId') todoId: string
) {
  return {
    userId,
    todoId,
    message: `User ${userId}'s todo ${todoId}`
  };
}
```

## 🔍 查詢參數 (Query Parameters)

### 基本查詢參數

查詢參數不需要在路由中預先定義：

```typescript
import { Controller, Get, Query } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get()
  getTodos(@Query() query: { limit?: number; skip?: number }) {
    const { limit = 30, skip = 0 } = query;
    
    const mockData = [
      { id: 1, title: 'Todo 1', description: 'First todo' },
      { id: 2, title: 'Todo 2', description: 'Second todo' },
      { id: 3, title: 'Todo 3', description: 'Third todo' }
    ];

    return {
      data: mockData.slice(skip, skip + limit),
      pagination: {
        limit,
        skip,
        total: mockData.length
      }
    };
  }
}
```

### 指定特定查詢參數

```typescript
@Get()
getTodos(
  @Query('limit') limit: number = 30,
  @Query('skip') skip: number = 0,
  @Query('search') search?: string
) {
  // 更清晰的參數處理
  return {
    limit,
    skip,
    search,
    message: 'Query parameters processed'
  };
}
```

**使用範例**: `GET /todos?limit=10&skip=5&search=important`

## 📊 HTTP 狀態碼

### 預設狀態碼

NestJS 的預設狀態碼規則：

- **GET, PUT, PATCH, DELETE**: 200 (OK)
- **POST**: 201 (Created)

### 自訂狀態碼

使用 `@HttpCode` 裝飾器設定特定狀態碼：

```typescript
import { Controller, Patch, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204
  updateTodo() {
    // 更新邏輯
    return; // 204 通常不返回內容
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) // 明確指定 201
  createTodo() {
    return { id: 1, title: 'New Todo' };
  }
}
```

### 常用 HTTP 狀態碼

| 狀態碼 | HttpStatus 常數 | 使用場景 |
|--------|-----------------|----------|
| 200 | `OK` | 成功獲取/更新資源 |
| 201 | `CREATED` | 成功創建資源 |
| 204 | `NO_CONTENT` | 成功但無內容返回 |
| 400 | `BAD_REQUEST` | 請求格式錯誤 |
| 404 | `NOT_FOUND` | 資源不存在 |
| 500 | `INTERNAL_SERVER_ERROR` | 伺服器內部錯誤 |

## 🎯 實戰範例：完整的 Todo Controller

```typescript
import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Delete, 
  Param, 
  Query, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';

@Controller('todos')
export class TodoController {
  // 獲取待辦清單
  @Get()
  getTodos(
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
    @Query('completed') completed?: boolean
  ) {
    return {
      data: [],
      pagination: { limit, skip },
      filter: { completed }
    };
  }

  // 獲取特定待辦事項
  @Get(':id')
  getTodoById(@Param('id') id: string) {
    return {
      id,
      title: `Todo ${id}`,
      completed: false
    };
  }

  // 創建待辦事項
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTodo() {
    return { id: 1, title: 'New Todo', completed: false };
  }

  // 更新待辦事項
  @Patch(':id')
  updateTodo(@Param('id') id: string) {
    return { id, title: 'Updated Todo', completed: true };
  }

  // 刪除待辦事項
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTodo(@Param('id') id: string) {
    // 刪除邏輯
    return;
  }
}
```

## 📋 本章重點總結

### 🎯 核心概念

- ✅ **Controller 職責**: 負責路由配置和處理客戶端請求
- ✅ **資源整合**: 可將相同路徑下的資源整合，包含子路由
- ✅ **裝飾器驅動**: 透過各種裝飾器輕鬆配置 API 端點

### 🛠️ 技術要點

- ✅ **路由參數**: 使用 `@Param` 裝飾器取得動態路由參數
- ✅ **查詢參數**: 使用 `@Query` 裝飾器處理 URL 查詢字串
- ✅ **狀態碼**: 使用 `@HttpCode` 和 `HttpStatus` 配置適當的 HTTP 狀態碼
- ✅ **HTTP Methods**: 支援所有標準 HTTP 方法的裝飾器

### 🔄 下一步學習

Controller 的功能非常豐富，本篇介紹了基礎概念和路由處理。接下來的內容將涵蓋：

- 🔜 **請求體處理**: `@Body` 裝飾器和 DTO 驗證
- 🔜 **檔案上傳**: 處理 multipart/form-data
- 🔜 **錯誤處理**: 異常處理和自訂錯誤回應
- 🔜 **中介軟體**: 請求前後的處理邏輯
- 🔜 **Guard 和 Interceptor**: 進階的請求處理機制

---

> **💡 學習提示**: 建議搭配實際專案練習，透過建立不同類型的 API 端點來加深對 Controller 概念的理解！