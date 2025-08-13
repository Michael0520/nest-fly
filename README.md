# Restaurant Management System

一個基於 NestJS 和 React 的餐廳管理系統，使用 pnpm workspace 管理的 monorepo 架構。

## 🏗️ 專案結構

```
nest-learn/
├── apps/
│   ├── backend/          # NestJS 後端 API
│   └── frontend/         # React 前端應用
├── packages/
│   └── shared/           # 共用型別和工具
├── pnpm-workspace.yaml   # pnpm workspace 配置
└── package.json          # 根目錄 package.json
```

## 🚀 快速開始

### 前置需求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL 資料庫

### 安裝依賴

```bash
pnpm install
```

### 環境設定

1. **後端設定**
   ```bash
   cd apps/backend
   cp .env.example .env
   # 編輯 .env 檔案，設定資料庫連接資訊
   ```

2. **前端設定**
   ```bash
   cd apps/frontend
   cp .env.example .env
   # 預設 API URL 為 http://localhost:3001
   ```

### 資料庫設定

```bash
# 執行資料庫遷移
pnpm db:migrate

# 執行種子資料
pnpm db:seed

# 開啟 Prisma Studio
pnpm db:studio
```

## 🛠️ 開發指令

### 同時啟動前後端開發伺服器

```bash
pnpm dev
```

### 個別啟動服務

```bash
# 只啟動後端
pnpm backend:dev

# 只啟動前端
pnpm frontend:dev
```

### 建置

```bash
# 建置所有專案
pnpm build

# 個別建置
pnpm backend:build
pnpm frontend:build
```

### 測試和代碼品質

```bash
# 執行所有測試
pnpm test

# 代碼檢查
pnpm lint

# 代碼格式化
pnpm format

# TypeScript 類型檢查
pnpm typecheck
```

### 其他有用的指令

```bash
# 清理所有 node_modules 和建置檔案
pnpm clean

# 建置共用套件
pnpm shared:build

# 重新安裝所有依賴
pnpm install:all
```

## 📡 API 端點

### 菜單管理
- `GET /restaurant/menu` - 獲取菜單
- `POST /restaurant/menu` - 新增菜單項目
- `PUT /restaurant/menu/:id` - 更新菜單項目
- `DELETE /restaurant/menu/:id` - 刪除菜單項目

### 訂單管理
- `GET /restaurant/orders` - 獲取所有訂單
- `POST /restaurant/orders` - 建立新訂單
- `GET /restaurant/orders/:id` - 獲取特定訂單
- `PATCH /restaurant/orders/:id/status` - 更新訂單狀態

## 🗄️ 資料庫

使用 PostgreSQL 作為主要資料庫，Prisma 作為 ORM。

### 主要資料表

- `menu_items` - 菜單項目
- `orders` - 訂單
- `order_items` - 訂單項目

## 🛡️ 技術棧

### 後端 (apps/backend)
- **框架**: NestJS
- **資料庫**: PostgreSQL
- **ORM**: Prisma
- **API 文件**: Swagger
- **驗證**: class-validator, class-transformer
- **測試**: Jest

### 前端 (apps/frontend)
- **框架**: React 19 + TypeScript
- **建置工具**: Vite
- **路由**: React Router
- **HTTP 客戶端**: Axios
- **樣式**: CSS3 (Grid + Flexbox)

### 共用 (packages/shared)
- **語言**: TypeScript
- **內容**: 型別定義、共用介面

## 🚀 部署

### 生產環境建置

```bash
pnpm build
```

### 啟動生產伺服器

```bash
pnpm start
```

## 📝 開發注意事項

1. **型別共用**: 前後端共用的型別定義放在 `packages/shared` 中
2. **代碼風格**: 使用 ESLint 和 Prettier 維持代碼一致性
3. **提交規範**: 請遵循 conventional commits 規範
4. **測試**: 新功能請撰寫相對應的測試

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送至分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權。