# Day 01: NestJS 餐廳管理 API 實作

## 📝 今日學習目標
建立一個完整的 NestJS 餐廳管理系統，學習 NestJS 核心概念並整合 Swagger API 文檔。

## 🚀 專案初始化

```bash
# 使用 NestJS CLI 建立專案
npx @nestjs/cli new nest-app
cd nest-app

# 安裝額外依賴
pnpm add @nestjs/swagger class-validator class-transformer
```

## 🏗️ 專案架構

```
src/
├── app.module.ts                    # 主模組，整合所有功能模組
├── app.controller.ts                # 主控制器，提供歡迎頁面和路由指南
├── app.service.ts                   # 主服務，處理歡迎訊息
├── main.ts                         # 應用啟動點，包含 Swagger 設定
├── restaurant/                     # 餐廳功能模組
│   ├── restaurant.module.ts        # 餐廳模組定義
│   ├── restaurant.controller.ts    # 餐廳控制器，定義 API 端點
│   ├── restaurant.service.ts       # 餐廳服務，處理業務邏輯
│   ├── restaurant.controller.spec.ts # 控制器單元測試
│   ├── restaurant.service.spec.ts   # 服務單元測試
│   └── dto/                        # 資料傳輸物件
│       ├── create-order.dto.ts     # 創建訂單 DTO
│       ├── update-order-status.dto.ts # 更新訂單狀態 DTO
│       ├── menu-response.dto.ts    # 菜單回應 DTO
│       └── order-response.dto.ts   # 訂單回應 DTO
├── types/
│   └── menu.interface.ts           # 菜單和訂單型別定義
└── test/                          # E2E 測試
    ├── app.e2e-spec.ts
    └── restaurant.e2e-spec.ts
```

## 🔧 核心功能實作

### 1. 型別定義 (`types/menu.interface.ts`)
```typescript
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description: string;
  cuisine: 'japanese' | 'italian' | 'general';
}

export interface Order {
  id: number;
  items: MenuItem[];
  totalPrice: number;
  customerName: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  orderTime: Date;
}
```

### 2. 餐廳服務 (`restaurant.service.ts`)
- 管理菜單項目 (3道菜：壽司拼盤、瑪格麗特披薩、漢堡套餐)
- 處理訂單創建、查詢、狀態更新
- 提供餐廳營運統計

### 3. 餐廳控制器 (`restaurant.controller.ts`)
使用 NestJS 裝飾器定義 RESTful API：
- `@Controller('restaurant')` - 定義路由前綴
- `@Get`, `@Post`, `@Patch` - 定義 HTTP 方法
- `@Param`, `@Body` - 參數綁定

### 4. Swagger 整合 (`main.ts`)
```typescript
const config = new DocumentBuilder()
  .setTitle('International Restaurant API')
  .setDescription('A NestJS learning example - Restaurant management system')
  .setVersion('1.0')
  .addTag('restaurant', 'Restaurant operations')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
```

## 📡 API 端點

| 方法 | 路徑 | 功能 | 描述 |
|------|------|------|------|
| GET | `/` | 歡迎頁面 | 顯示歡迎訊息和可用路由 |
| GET | `/restaurant/menu` | 取得完整菜單 | 返回所有菜單項目 |
| GET | `/restaurant/menu/:id` | 取得特定菜單項目 | 根據 ID 查詢菜單項目 |
| POST | `/restaurant/order` | 創建訂單 | 建立新的客戶訂單 |
| GET | `/restaurant/orders` | 取得所有訂單 | 返回餐廳所有訂單 |
| GET | `/restaurant/order/:id` | 取得特定訂單 | 根據 ID 查詢訂單 |
| PATCH | `/restaurant/order/:id/status` | 更新訂單狀態 | 更新訂單處理狀態 |
| GET | `/restaurant/stats` | 取得餐廳統計 | 返回營運統計資料 |

## 🧪 測試覆蓋

### 單元測試 (11/11 通過)
- `app.controller.spec.ts` - 主控制器測試
- `restaurant.controller.spec.ts` - 餐廳控制器測試 (5個測試)
- `restaurant.service.spec.ts` - 餐廳服務測試 (5個測試)

### E2E 測試 (5/5 通過)
- `app.e2e-spec.ts` - 主應用 E2E 測試
- `restaurant.e2e-spec.ts` - 餐廳功能 E2E 測試

```bash
# 執行測試
pnpm run test        # 單元測試
pnpm run test:e2e    # E2E 測試
pnpm run test:cov    # 測試覆蓋率
```

## 🔍 程式碼品質

### ESLint 配置優化
針對測試檔案放寬 TypeScript 嚴格規則：
```javascript
{
  files: ['**/*.spec.ts', '**/*.e2e-spec.ts', 'test/**/*.ts'],
  rules: {
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/unbound-method': 'off',
  },
}
```

## 📚 學到的核心概念

### 1. NestJS 核心裝飾器
- `@Module()` - 定義模組
- `@Controller()` - 定義控制器
- `@Injectable()` - 定義可注入服務
- `@Get()`, `@Post()`, `@Patch()` - HTTP 方法裝飾器
- `@Param()`, `@Body()` - 參數裝飾器

### 2. 依賴注入 (Dependency Injection)
```typescript
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
}
```

### 3. DTO 與資料驗證
使用 `class-validator` 進行請求資料驗證：
```typescript
export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  itemIds: number[];
}
```

### 4. Swagger API 文檔
使用裝飾器生成互動式 API 文檔：
```typescript
@ApiOperation({ summary: 'Create a new order' })
@ApiBody({ type: CreateOrderDto })
@ApiResponse({ status: 201, description: 'Order created successfully' })
```

## 🚀 啟動應用

```bash
# 開發模式啟動
pnpm run start:dev

# 應用運行在
# 🍽️ http://localhost:3001
# 📖 Swagger 文檔: http://localhost:3001/api
```

## 📋 專案連結

- **應用首頁**: [http://localhost:3001](http://localhost:3001)
- **Swagger API 文檔**: [http://localhost:3001/api](http://localhost:3001/api)
- **專案位置**: `/Users/luoziming/github-project/nest-learn/nest-app`

## 🎯 學習成果

✅ **完成項目**:
- [x] 建立 NestJS 專案結構
- [x] 實作餐廳管理 API
- [x] 整合 Swagger 文檔
- [x] 撰寫完整測試
- [x] 配置 ESLint 程式碼品質
- [x] 使用 TypeScript 型別安全
- [x] 實作 RESTful API 設計

✅ **掌握技能**:
- NestJS 模組化架構
- 依賴注入模式
- 裝飾器使用
- DTO 資料驗證
- API 文檔生成
- 單元測試與 E2E 測試

## 📝 後續改進方向
1. 整合資料庫 (PostgreSQL/MongoDB)
2. 加入用戶認證與授權
3. 實作更複雜的業務邏輯
4. 加入 Docker 容器化
5. 實作快取機制 (Redis)

---

**Day 01 完成！** 🎉 成功建立了一個功能完整的 NestJS 餐廳管理 API，具備完整的文檔、測試和程式碼品質保證。