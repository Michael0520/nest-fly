# NestJS Controller 深入解析 (下)

## 📝 前言

在上一篇中，我們學習了 Controller 的基礎概念和路由系統。本篇將深入探討 Controller 的進階功能，包括**請求資料處理**、**DTO 使用**、**回應處理模式**等重要主題。

> **🎯 學習目標**: 掌握 Controller 處理請求資料的各種方式，了解標準模式與函式庫模式的差異，並學會使用 DTO 來確保資料的型別安全。

## 📦 主體資料 (Body)

### 基本使用方式

在處理 POST、PUT、PATCH 等操作時，經常需要接收客戶端傳送的資料。NestJS 提供 `@Body` 裝飾器來取得請求主體資料：

```typescript
import { Body, Controller, Post } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Post()
  create(@Body() data: { title: string, description?: string }) {
    const id = 1;
    return { id, ...data };
  }
}
```

### 取得特定欄位

也可以透過指定參數名稱來取得特定欄位：

```typescript
import { Body, Controller, Post } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Post()
  create(
    @Body('title') title: string,
    @Body('description') description?: string
  ) {
    const id = 1;
    return { id, title, description };
  }
}
```

> **💡 提示**: 指定特定欄位的方式適合簡單的資料結構，但對於複雜的資料建議使用 DTO。

### 🔗 前端對接範例

```javascript
// Frontend (使用 fetch API)
const createTodo = async () => {
  const response = await fetch('http://localhost:3000/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Learn NestJS',
      description: 'Study Controller concepts'
    })
  });
  
  const data = await response.json();
  console.log(data); // { id: 1, title: 'Learn NestJS', description: 'Study Controller concepts' }
};
```

## 🎯 使用 DTO (Data Transfer Object)

### 什麼是 DTO？

**DTO (Data Transfer Object)** 是資料傳輸物件的縮寫，主要用途包括：

- 📋 **定義資料結構**: 明確定義 API 的輸入/輸出格式
- 🛡️ **型別安全**: 提供 TypeScript 型別檢查
- ✅ **資料驗證**: 搭配 class-validator 進行自動驗證
- 📖 **文件生成**: 自動生成 Swagger 文件
- 🔒 **資料過濾**: 只傳遞必要的資料欄位

### DTO vs Interface

在 NestJS 中建立 DTO 有兩種選擇：

| 方式 | 優點 | 缺點 | 建議使用場景 |
|------|------|------|------------|
| **class** | ✅ 編譯後保留<br>✅ 支援裝飾器<br>✅ 可進行執行時驗證 | 稍微增加 bundle 大小 | **推薦使用** |
| **interface** | 編譯後無額外程式碼 | ❌ 編譯後消失<br>❌ 無法使用裝飾器 | 僅用於內部型別定義 |

> **⚠️ 官方建議**: 使用 **class** 來建立 DTO，因為 interface 在編譯成 JavaScript 後會被移除，無法進行執行時驗證。

### 建立 DTO

在 Controller 目錄下建立 `dto` 資料夾，並建立對應的 DTO 檔案：

```typescript
// src/todos/dto/create-todo.dto.ts
export class CreateTodoDto {
  public readonly title: string;
  public readonly description?: string;
}
```

### 在 Controller 中使用 DTO

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodoController {
  @Post()
  create(@Body() dto: CreateTodoDto) {
    const id = 1;
    return { id, ...dto };
  }
}
```

### 🎓 前端工程師視角

如果你是前端工程師，可以這樣理解 DTO：

```javascript
// Frontend - 定義表單資料結構
interface TodoForm {
  title: string;
  description?: string;
}

// Backend (NestJS) - 使用 DTO 接收相同結構
export class CreateTodoDto {
  title: string;
  description?: string;
}
```

> **💡 類比說明**: DTO 就像前端的表單驗證規則，確保資料符合預期格式後才進行處理。

## 📨 標頭設置 (Headers)

### 設置回應標頭

使用 `@Header` 裝飾器可以設置自訂的回應標頭：

```typescript
import { Controller, Get, Header } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get()
  @Header('X-Custom-Header', 'custom-value')
  @Header('Cache-Control', 'none')
  getAll() {
    return {
      id: 1,
      title: 'Learn NestJS',
      description: 'Study headers configuration'
    };
  }
}
```

### 常用標頭設置範例

```typescript
@Controller('files')
export class FileController {
  @Get('download')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="document.pdf"')
  downloadFile() {
    // 返回檔案內容
  }

  @Get('image')
  @Header('Content-Type', 'image/png')
  @Header('Cache-Control', 'public, max-age=3600')
  getImage() {
    // 返回圖片內容
  }
}
```

## 🎨 參數裝飾器完整列表

NestJS 提供豐富的參數裝飾器來取得請求的各種資訊：

### 📊 裝飾器對照表

| 裝飾器 | 別名 | 對應 Express | 用途說明 |
|--------|------|-------------|----------|
| `@Request()` | `@Req()` | `req` | 取得完整請求物件 |
| `@Response()` | `@Res()` | `res` | 取得回應物件 |
| `@Next()` | - | `next` | 呼叫下一個中介軟體 |
| `@Param(key?)` | - | `req.params[key]` | 取得路由參數 |
| `@Query(key?)` | - | `req.query[key]` | 取得查詢參數 |
| `@Body(key?)` | - | `req.body[key]` | 取得請求主體 |
| `@Headers(name?)` | - | `req.headers[name]` | 取得請求標頭 |
| `@Session()` | - | `req.session` | 取得 session 資料 |
| `@Ip()` | - | `req.ip` | 取得客戶端 IP |
| `@HostParam()` | - | `req.hosts` | 取得 host 參數 |

### 實際使用範例

```typescript
import { 
  Controller, 
  Get, 
  Req, 
  Res, 
  Param, 
  Query, 
  Headers, 
  Ip 
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('demo')
export class DemoController {
  @Get(':id')
  getDemo(
    @Req() request: Request,                    // 完整請求物件
    @Param('id') id: string,                    // 路由參數
    @Query('sort') sort: string,                // 查詢參數
    @Headers('authorization') auth: string,     // 請求標頭
    @Ip() ipAddress: string                     // 客戶端 IP
  ) {
    return {
      id,
      sort,
      hasAuth: !!auth,
      clientIp: ipAddress,
      userAgent: request.headers['user-agent']
    };
  }
}
```

## 🔄 回應處理模式

NestJS 提供兩種處理回應的方式，每種都有其適用場景：

### 📌 標準模式 (Standard Mode) - 推薦使用

> **✅ 官方推薦**: 這是 NestJS 最推薦的方式，讓框架自動處理回應。

#### 基本範例

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get()
  getAll() {
    return [];  // NestJS 自動處理回應
  }
}
```

#### 支援非同步操作

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  @Get()
  async getAll() {
    // 模擬資料庫查詢
    const todos = await new Promise((resolve) => 
      setTimeout(() => resolve([
        { id: 1, title: 'Learn NestJS' },
        { id: 2, title: 'Build API' }
      ]), 1000)
    );
    return todos;
  }
}
```

#### 支援 RxJS Observable

```typescript
import { Controller, Get } from '@nestjs/common';
import { of, map, delay } from 'rxjs';

@Controller('todos')
export class TodoController {
  @Get()
  getAll() {
    // NestJS 會自動訂閱和取消訂閱
    return of([
      { id: 1, title: 'Learn RxJS' },
      { id: 2, title: 'Master Observables' }
    ]).pipe(
      delay(1000),  // 延遲 1 秒
      map(todos => ({ data: todos, timestamp: new Date() }))
    );
  }
}
```

### 🔧 函式庫模式 (Library-Specific Mode)

直接使用底層框架（Express/Fastify）的回應物件：

```typescript
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('todos')
export class TodoController {
  @Get()
  getAll(@Res() res: Response) {
    // 直接操作 Express 的 response 物件
    res.status(200).json([
      { id: 1, title: 'Direct response' }
    ]);
    // 注意：不需要 return
  }
}
```

### ⚠️ 模式切換的限制

當使用 `@Res()`、`@Response()` 或 `@Next()` 時，會自動切換到函式庫模式：

```typescript
// ❌ 錯誤範例：混用兩種模式
@Controller('todos')
export class TodoController {
  @Get()
  getAll(@Res() res: Response) {
    return [];  // ❌ 這個 return 會被忽略！
    // 必須使用 res.send() 或 res.json()
  }
}
```

### 💡 突破限制：Passthrough 選項

如果需要存取 response 物件但又想使用標準模式，可以使用 `passthrough` 選項：

```typescript
import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('todos')
export class TodoController {
  @Get()
  getAll(@Res({ passthrough: true }) res: Response) {
    // 可以設置標頭或 cookie
    res.cookie('visited', 'true');
    
    // 仍然使用 return 回傳資料
    return {
      data: [],
      message: 'Cookie has been set'
    };
  }
}
```

### 📊 模式比較表

| 特性 | 標準模式 | 函式庫模式 |
|------|----------|------------|
| **使用方式** | `return data` | `res.send(data)` |
| **非同步支援** | ✅ async/await、Promise、Observable | ⚠️ 需手動處理 |
| **攔截器支援** | ✅ 完整支援 | ❌ 部分功能失效 |
| **測試便利性** | ✅ 容易測試 | ⚠️ 需要 mock response |
| **適用場景** | 🎯 一般 API 開發 | 🔧 特殊需求（串流、SSE） |

## 🎓 前端工程師視角理解

### Vue.js 類比

```javascript
// Frontend (Vue.js)
export default {
  methods: {
    async fetchTodos() {
      // 前端發送請求
      const response = await fetch('/todos');
      return response.json();
    }
  }
}

// Backend (NestJS)
@Controller('todos')
export class TodoController {
  @Get()
  async getTodos() {
    // 後端處理並回應
    return this.todoService.findAll();
  }
}
```

### React 類比

```javascript
// Frontend (React)
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  
  useEffect(() => {
    fetch('/todos')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);
}

// Backend (NestJS) - 提供資料給前端
@Controller('todos')
export class TodoController {
  @Get()
  getTodos() {
    return this.todoService.findAll();
  }
}
```

## 📋 本章重點總結

### 🎯 核心概念

- ✅ **@Body 裝飾器**: 接收 POST/PUT/PATCH 請求的資料
- ✅ **DTO 模式**: 使用 class 定義資料結構，確保型別安全
- ✅ **@Header 裝飾器**: 設置自訂回應標頭
- ✅ **參數裝飾器**: 豐富的裝飾器取得請求各部分資訊

### 🛠️ 技術要點

- ✅ **標準模式 vs 函式庫模式**: 了解兩種回應處理方式的差異
- ✅ **Passthrough 選項**: 在標準模式下存取 response 物件
- ✅ **非同步支援**: async/await、Promise、RxJS Observable
- ✅ **模式切換限制**: 使用 @Res 會自動切換到函式庫模式

### 💡 最佳實踐

1. **優先使用標準模式**: 除非有特殊需求，否則使用 `return` 方式
2. **善用 DTO**: 定義清晰的資料結構，提高程式碼可維護性
3. **適當設置標頭**: 根據需求設置快取、內容類型等標頭
4. **選擇合適的裝飾器**: 只取得需要的資訊，避免過度使用 @Req()

### 🔄 下一步學習

Controller 的進階功能已經介紹完畢，接下來將學習：

- 🔜 **Module 系統**: 如何組織和管理應用程式模組
- 🔜 **Provider 與依賴注入**: 深入了解 NestJS 的核心設計模式
- 🔜 **中介軟體 (Middleware)**: 請求處理管道的進階應用
- 🔜 **例外處理**: 優雅地處理錯誤和異常情況

---

> **💡 學習建議**: Controller 是 NestJS 的核心元件，建議配合實際專案練習，嘗試建立不同類型的 API 端點，並使用 Postman 或 Swagger 進行測試！