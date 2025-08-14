# 🧠 NestJS 學習日誌

> 💡 **學習目標**：通過實作餐廳管理系統來深度掌握 NestJS 框架
> 
> 🔗 **技術指南**：開發相關的技術資訊請參考 `CLAUDE.md` (本地檔案)

---

## 📊 學習進度總覽

| 🎯 學習主題 | 📚 學習進度 | 🛠️ 實際應用 | 📝 筆記位置 | ⏱️ 更新時間 |
|------------|------------|------------|-----------|-----------|
| **NestJS 基礎** | ✅ 100% | ✅ 完全掌握 | `02-hello-nestjs.md` | 2025-08-13 |
| **Controller 上篇** | ✅ 100% | ✅ 完全掌握 | `03-controller-top.md` | 2025-08-13 |
| **Controller 下篇** | ✅ 100% | ✅ 完全掌握 | `04-controller-bottom.md` | 2025-08-13 |
| **Module 系統** | ✅ 80% | ✅ 基礎應用 | `05-module.md` | 2025-08-13 |
| **Provider 基礎** | ✅ 60% | ⚠️ 部分應用 | `06-providers-top.md` | 2025-08-13 |
| **Provider 進階** | ❌ 0% | ❌ 尚未開始 | `08-providers-bottom.md` | - |

### 🎖️ 學習成就
- **✅ 核心概念掌握**：Module、Controller、Service 架構
- **✅ API 設計精通**：RESTful API、DTO 驗證、Swagger 文檔
- **✅ 資料庫整合**：Prisma ORM、型別安全操作
- **✅ 全端部署**：Vercel 無伺服器部署成功

---

## 🎓 學習里程碑

### 📚 第一階段：NestJS 基礎概念
**完成時間**：2025-08-13  
**學習重點**：
- ✨ **依賴注入理解**：掌握 IoC 容器概念
- 🏗️ **模組化架構**：理解 Module-Controller-Service 分層
- 🛠️ **開發工具**：熟練使用 NestJS CLI

**實作成果**：
- 🎯 成功建立 `RestaurantModule` 組織餐廳功能
- 🔗 正確實現服務間的依賴注入
- 📁 建立清晰的專案結構

**心得收穫**：
> 💭 NestJS 的模組化設計讓程式架構變得非常清晰，依賴注入機制大大降低了耦合度。

### 🌐 第二階段：Controller 與 API 設計
**完成時間**：2025-08-13  
**學習重點**：
- 🔗 **路由設計**：RESTful API 設計原則
- 📦 **資料驗證**：DTO 與 class-validator 整合
- 📋 **API 文檔**：Swagger 自動生成文檔

**實作成果**：
- 🎯 完整的餐廳 API 端點設計
- 📝 建立 4 個核心 DTO 類別
- 📊 自動生成 Swagger API 文檔

**學習突破**：
- 🚀 **型別安全**：從請求到回應的完整型別檢查
- 🔧 **錯誤處理**：優雅的 HTTP 狀態碼管理

**心得收穫**：
> 💭 DTO 模式真的很強大！不只提供型別安全，還能自動生成 API 文檔，大大提升開發效率。

### 🏗️ 第三階段：Module 系統架構
**完成程度**：80%  
**學習重點**：
- 📦 **模組化設計**：功能內聚、低耦合的架構
- 🔄 **模組通信**：imports/exports 機制
- 🎯 **職責分離**：清晰的模組邊界

**實作成果**：
- 🏢 獨立的 `RestaurantModule` 模組
- 🔗 正確的模組依賴關係
- 📋 服務的匯入匯出管理

**心得收穫**：
> 💭 模組系統讓大型專案的管理變得可行，每個模組都有清晰的邊界和職責。

---

## 🚧 正在學習中

### ⚙️ Provider 基礎概念
**當前進度**：60%  
**已掌握**：
- ✅ 基本 Service Provider 的建立
- ✅ `@Injectable()` 裝飾器使用
- ✅ 基礎依賴注入實作

**學習盲點**：
- ❓ **自訂 Provider 模式**：useValue、useClass、useFactory
- ❓ **Token 機制**：如何使用自訂 Token
- ❓ **異步 Provider**：處理非同步初始化

**下一步計畫**：
- 📚 深入學習 Provider 進階模式
- 🛠️ 實作 Factory Provider 來處理配置
- 🎯 建立可重用的共享服務

---

## 📋 待學習與實作

### 5. Provider 進階技巧 (08-providers-bottom.md)

**計畫學習：**
- [ ] 自訂 Provider 的各種模式
  - [ ] `useValue` - 靜態值注入
  - [ ] `useClass` - 動態類別替換
  - [ ] `useFactory` - 工廠模式建立
- [ ] 非同步 Provider 的實作
- [ ] 可選擇性注入 (`@Optional()`)
- [ ] Provider 的匯出與共享

**計畫實作範例：**
```typescript
// 待實作：配置 Provider
const DATABASE_CONFIG = {
  provide: 'DATABASE_CONFIG',
  useValue: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
};

// 待實作：Factory Provider
{
  provide: 'LOGGER_SERVICE',
  useFactory: async (config: ConfigService) => {
    const logLevel = await config.getLogLevel();
    return new LoggerService(logLevel);
  },
  inject: [ConfigService]
}
```

### 6. 尚未接觸的進階主題

**計畫學習順序：**
1. [ ] **Guards** - 路由守衛與身份驗證
2. [ ] **Interceptors** - 請求/回應攔截器
3. [ ] **Pipes** - 資料轉換與驗證管道
4. [ ] **Middleware** - 中介軟體
5. [ ] **Exception Filters** - 異常處理器
6. [ ] **Decorators** - 自訂裝飾器
7. [ ] **Dynamic Modules** - 動態模組
8. [ ] **Testing** - 單元測試與整合測試

---

## 💡 學習心得與重點筆記

### 成功經驗

1. **模組化設計：** 成功將餐廳功能獨立成 `RestaurantModule`，實現了清晰的職責分離
2. **API 設計：** 建立了完整的 RESTful API，包含菜單瀏覽、訂單管理、狀態更新等功能
3. **資料驗證：** 使用 DTO 和 class-validator 確保資料的型別安全
4. **資料庫整合：** 成功整合 Prisma ORM，實現資料持久化

### 遇到的問題與解決方案

1. **Vercel 部署問題：**
   - 問題：vercel.json 配置錯誤（同時使用 functions 和 builds）
   - 解決：移除 functions 屬性，只保留 builds

2. **資料庫初始化：**
   - 問題：部署後資料庫沒有初始資料
   - 解決：建立安全的初始化 API (`/restaurant/admin/init-menu`)

3. **CORS 配置：**
   - 問題：前端無法連接後端 API
   - 解決：在 api/index.ts 中正確配置 CORS

### 重要概念理解

1. **依賴注入的好處：**
   - 降低耦合度
   - 提升可測試性
   - 便於程式維護

2. **模組設計原則：**
   - 相同功能歸類在同一模組
   - 透過 imports/exports 管理模組依賴
   - 避免循環依賴

---

## 🎯 下一步學習計畫

### 短期目標 (1-2 週)
1. [ ] 深入學習 Provider 的進階模式
2. [ ] 在專案中實作自訂 Provider
3. [ ] 嘗試 Factory Provider 建立配置服務

### 中期目標 (1 個月)
1. [ ] 學習 Guards 實作身份驗證
2. [ ] 加入 Interceptors 處理回應格式
3. [ ] 使用 Pipes 優化資料驗證

### 長期目標 (2-3 個月)
1. [ ] 建立完整的測試覆蓋
2. [ ] 實作進階的錯誤處理
3. [ ] 學習微服務架構

---

## 📚 學習資源

- [NestJS 官方文檔](https://docs.nestjs.com/)
- 個人筆記：`apps/backend/note/` 目錄
- 實作專案：Restaurant Management System
- 部署環境：Vercel (前端 + 後端)

---

*最後更新：2025-08-13*