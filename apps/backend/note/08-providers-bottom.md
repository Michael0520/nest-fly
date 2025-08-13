# NestJS Provider 進階技巧：非同步與模組化實作

## 📚 前言

本系列文已出版成書「NestJS 基礎必學實務指南：使用強大且易擴展的 Node.js 框架打造網頁應用程式」，感謝 iT 邦幫忙與博碩文化的協助。如果對 NestJS 有興趣、覺得這個系列文對你有幫助的話，歡迎前往購書，你的支持是我最大的寫作動力！

## 🎯 學習目標

掌握 NestJS Provider 的進階技巧，包括自訂 Provider 的匯出、非同步 Provider 的實作，以及可選擇性注入的處理方式。

## 📖 前置知識

在前一篇文章中，我們學習了 Provider 的基本概念和各種實作模式。本文將深入探討更進階的 Provider 使用技巧，讓你能夠在實際專案中靈活運用這些功能。

## 🔄 匯出自訂 Provider

### 問題場景

在介紹共享模組的時候，有提到可以透過 Module 的 `exports` 將 Provider 匯出，那自訂 Provider 要如何匯出呢？這部分可以透過一些小技巧來達成。

### 實作步驟

#### 1. 建立測試模組

首先建立一個 HandsomeModule 來做測試：

```bash
nest generate module handsome
```

#### 2. 定義可重用的 Provider

我們把 Custom Provider 的**展開式用變數儲存起來**，再將該展開式放到 `providers` 與 `exports` 中：

```typescript
// handsome.module.ts
import { Module } from '@nestjs/common';

const HANDSOME_HAO = {
  provide: 'HANDSOME_MAN',
  useValue: {
    name: 'HAO'
  }
};

@Module({
  providers: [
    HANDSOME_HAO
  ],
  exports: [
    HANDSOME_HAO
  ]
})
export class HandsomeModule {}
```

#### 3. 在 AppModule 進行匯入

修改 app.module.ts：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HandsomeModule } from './handsome/handsome.module';

@Module({
  imports: [HandsomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### 4. 驗證結果

修改 app.controller.ts 查看結果：

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('HANDSOME_MAN') private readonly handsomeMan
  ) {
    console.log(this.handsomeMan);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

會在終端機看到：

```json
{ name: 'HAO' }
```

## ⏳ 非同步 Provider

### 使用場景

有時候可能需要等待某些非同步的操作來建立 Provider，比如：

- 🔌 需要與資料庫建立連線
- 🌐 需要從遠端 API 取得配置
- 📁 需要讀取外部配置檔案

> 💡 **重要**：Nest App 會等待該 Provider 建立完成才正式啟動

### 實作範例

調整 handsome.module.ts 的內容，使用非同步工廠：

```typescript
import { Module } from '@nestjs/common';

const HANDSOME_HAO = {
  provide: 'HANDSOME_MAN',
  useFactory: async () => {
    // 模擬非同步操作（例如資料庫連線）
    const getHAO = new Promise(resolve => {
      setTimeout(() => resolve({ name: 'HAO' }), 2000);
    });
    
    const HAO = await getHAO;
    return HAO;
  }
};

@Module({
  providers: [
    HANDSOME_HAO
  ],
  exports: [
    HANDSOME_HAO
  ]
})
export class HandsomeModule {}
```

### 執行結果

在等待兩秒後，終端機會出現下方結果：

```json
{ name: 'HAO' }
```

### 實際應用範例

在真實專案中，非同步 Provider 常用於：

```typescript
// 資料庫連線範例
const DATABASE_CONNECTION = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      // ... 其他配置
    });
    return connection;
  }
};

// API 配置範例
const API_CONFIG = {
  provide: 'API_CONFIG',
  useFactory: async () => {
    const response = await fetch('https://api.example.com/config');
    const config = await response.json();
    return config;
  }
};
```

## 🔧 自選式 Provider

### 關於可選性注入

有時候可能會有 Provider **沒有被提供但卻需要注入**的情況，這樣在啟動時會報錯，因為 Nest 找不到對應的 Provider。

### 解決方案

遇到這類型情況的處理方式：

1. **給予預設值**代替沒被注入的 Provider
2. **添加 `@Optional` 裝飾器**在注入的地方

### 實作步驟指南

#### 1. 移除 Provider 來源

修改 app.module.ts，將 HandsomeModule 移除匯入：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [], // 移除 HandsomeModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

#### 2. 使用 @Optional 裝飾器

修改 app.controller.ts，替 HANDSOME_MAN 給定預設值：

```typescript
import { Controller, Get, Inject, Optional } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Optional() 
    @Inject('HANDSOME_MAN') 
    private readonly handsomeMan = { name: '' } // 預設值
  ) {
    console.log(this.handsomeMan);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### 結果驗證

此時的終端機會顯示結果：

```json
{ name: '' }
```

### 實際應用案例

```typescript
// 可選的快取服務
@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Optional()
    @Inject('CACHE_SERVICE')
    private readonly cacheService?: CacheService
  ) {}

  async getUser(id: string) {
    // 如果有快取服務就使用，沒有就直接查詢
    if (this.cacheService) {
      const cached = await this.cacheService.get(`user:${id}`);
      if (cached) return cached;
    }

    const user = await this.userService.findById(id);
    
    // 如果有快取服務就存入快取
    if (this.cacheService) {
      await this.cacheService.set(`user:${id}`, user);
    }

    return user;
  }
}
```

## 📊 Provider 進階技巧總覽

| 技巧 | 使用場景 | 關鍵點 |
|------|----------|--------|
| **匯出自訂 Provider** | 跨模組共享自訂 Provider | 將展開式儲存為變數 |
| **非同步 Provider** | 需要等待外部資源初始化 | 使用 `useFactory` + `async/await` |
| **自選式 Provider** | Provider 不一定存在的場景 | `@Optional` + 預設值 |

## 🎯 最佳實踐建議

### 1. 自訂 Provider 命名規範

```typescript
// ✅ 好的命名
const DATABASE_CONNECTION_PROVIDER = {
  provide: 'DATABASE_CONNECTION',
  // ...
};

const REDIS_CLIENT_PROVIDER = {
  provide: 'REDIS_CLIENT',
  // ...
};

// ❌ 不好的命名
const PROVIDER1 = {
  provide: 'SOMETHING',
  // ...
};
```

### 2. 非同步 Provider 錯誤處理

```typescript
const EXTERNAL_API_PROVIDER = {
  provide: 'EXTERNAL_API',
  useFactory: async () => {
    try {
      const api = await createApiConnection();
      return api;
    } catch (error) {
      console.error('Failed to connect to external API:', error);
      // 返回 null 或預設實作
      return null;
    }
  }
};
```

### 3. 型別安全的可選注入

```typescript
interface CacheService {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
}

@Controller()
export class UserController {
  constructor(
    @Optional()
    @Inject('CACHE_SERVICE')
    private readonly cacheService: CacheService | null = null
  ) {}
}
```

## 🎯 小結

今天的內容主要是針對 Provider 的一些進階技巧做介紹，重點整理如下：

### ✅ 重點回顧

1. **自訂 Provider 匯出**
   - 透過把展開式抽離至變數來進行匯出
   - 確保 Provider 可以在多個模組間共享

2. **非同步 Provider**
   - 支援非同步建立，使用 `useFactory` + `async/await`
   - 在尚未建立完 Provider 以前，Nest App 不會正式啟動
   - 適用於資料庫連線、外部 API 初始化等場景

3. **自選式 Provider**
   - 如果 Provider 並不是必須項目，必須在注入的地方添加 `@Optional`
   - 建議替該參數設置預設值，提升程式穩定性

### 🚀 下一步

在了解完 Nest 鐵三角（Controller、Service、Module）和 Provider 的進階技巧之後，就可以開始介紹一些其他的功能了：

- 中介軟體 (Middleware)
- 攔截器 (Interceptors)  
- 管道 (Pipes)
- 守衛 (Guards)
- 例外過濾器 (Exception Filters)
