# Nest 基本概念

## 什麼是 NestJS？
NestJS 是一個用於構建高效、可擴展的 Node.js 服務端應用程式的框架。它完全使用 TypeScript 編寫（同時也支援純 JavaScript），並結合了物件導向程式設計（OOP）、函數式程式設計（FP）和函數響應式程式設計（FRP）的元素。

## 核心架構設計
Nest 採用模組化設計，將各個不同的功能區塊打包成**模組（Module）**。每個應用程式必定有**一個以上**的模組，並且是以**樹狀結構**發散出去，最頂部的 Module 稱為**根模組（Root Module）**，其概念如下：
https://ithelp.ithome.com.tw/upload/images/20210302/20119338Qs3P92SDp6.png

## 模組的組成要素
一個具有路由機制的 Module 通常會包含**控制器（Controller）**與**服務（Service）**，它們之間透過依賴注入建立關係：
https://ithelp.ithome.com.tw/upload/images/20210303/20119338k0YJe9Uv2Y.png

### 依賴注入的優勢
從圖中可以看出 Controller 與 Service 透過 Module 建立關係後，即可將 Service **注入（Inject）**到 Controller 中使用。這樣設計的好處包括：
- **職責分離**：Controller 專注於處理 HTTP 請求，Service 專注於業務邏輯
- **可測試性**：Service 可以獨立測試，不需要模擬 HTTP 環境
- **可重用性**：Service 可以被多個 Controller 共用
- **鬆耦合**：透過介面而非實作來依賴，易於替換和擴展

### 實際的請求處理流程

1. 使用者向 Nest App 發出 HTTP 請求
2. 由 Controller 接收並解析請求（包含路由匹配、參數驗證等）
3. Controller 透過注入的 Service 來調用相應的方法，處理業務邏輯
4. Service 執行業務邏輯（可能包含資料庫操作、外部 API 呼叫等）
5. Service 返回處理結果給 Controller
6. Controller 將結果格式化並回傳給使用者
### 生活化的比喻
用現實生活中的例子來說明 Nest 整體概念的話，Nest App 就像一間有多國料理的餐廳：
- **Nest App** = 整間餐廳
- **Module** = 各國料理區（日式料理區、義式料理區等）
- **Controller** = 外場服務生（接待客人、處理點餐）
- **Service** = 內場廚師（準備料理、處理食材）
- **Provider** = 支援服務（倉管、採購、清潔等）

當客人走進餐廳時，先依照想吃的異國料理來安排座位，外場服務生協助客人點餐並將訂單送至內場，內場人員開始針對客人的訂單做料理，當餐點做好了之後，再請外場服務生送到客人面前：
https://ithelp.ithome.com.tw/upload/images/20210313/20119338f25enATx2G.png

現在對於 Nest 應該有些概念了，那就來看怎麼建置第一個 Nest App 吧！

## 環境準備

### 前置需求
在開始之前，請確保你的開發環境已安裝：
- **Node.js**（建議版本 16.x 或更高）
- **npm** 或 **yarn**（套件管理工具）

### 安裝 Nest CLI
Nest 官方設計了一套 CLI 來幫助開發者加速開發。透過 Nest CLI 可以：
- 自動產生程式碼骨架（Controller、Service、Module 等）
- 建立新專案的基礎架構
- 執行開發伺服器與熱重載
- 編譯 TypeScript 程式碼

安裝方式很簡單，只需要透過 npm 進行全域安裝即可，在終端機輸入下方指令：

```bash
$ npm install -g @nestjs/cli
```

安裝完成後，可以透過終端機使用 Nest CLI。查看可用的指令：

```bash
$ nest --help
```
https://ithelp.ithome.com.tw/upload/images/20210226/20119338rBCCIh8c6l.png

## 建置第一個 Nest App

### 建立新專案
透過 Nest CLI 的 `new` 指令來快速建立 App：

> **提醒**：注意終端機當前位於資料夾何處，建議透過 `cd` 指令移動到想要的位置。

```bash
$ nest new <APP_NAME>
# 例如：nest new my-first-nest-app
```
執行指令後，CLI 會：
1. 建立專案資料夾與基礎檔案結構
2. 詢問要使用哪種套件管理工具：
https://ithelp.ithome.com.tw/upload/images/20210226/20119338Iwr5Dtr0il.png

> **提醒**：這裡可以根據個人喜好選擇（npm、yarn 或 pnpm），本文範例使用 npm。

### 啟動應用程式
等待依賴套件安裝完成後，進入專案資料夾並啟動應用程式：

```bash
$ cd <APP_NAME>
$ npm run start

# 如果要使用開發模式（支援熱重載）
$ npm run start:dev
```
Nest 預設使用 3000 port。啟動成功後，在瀏覽器輸入 `http://localhost:3000` 查看結果：
https://ithelp.ithome.com.tw/upload/images/20210226/201193388OtXc1IebQ.png

## 專案結構解析

### 資料夾結構
透過 Nest CLI 建置的專案預設資料夾結構如下：

```
.
├─ dist/                    # 編譯後的 JavaScript 檔案
├─ node_modules/            # npm 套件
├─ src/                     # 原始碼目錄
│  ├─ app.controller.ts     # 根控制器
│  ├─ app.controller.spec.ts # 控制器測試檔
│  ├─ app.module.ts         # 根模組
│  ├─ app.service.ts        # 根服務
│  └─ main.ts               # 應用程式進入點
├─ test/                    # E2E 測試目錄
│  ├─ app.e2e-spec.ts       # E2E 測試檔
│  └─ jest-e2e.json         # Jest E2E 設定
├─ .eslintrc.js             # ESLint 設定
├─ .gitignore               # Git 忽略檔案
├─ .prettierrc              # Prettier 格式化設定
├─ nest-cli.json            # Nest CLI 設定
├─ package.json             # 專案資訊與相依套件
├─ package-lock.json        # 套件版本鎖定檔
├─ tsconfig.json            # TypeScript 設定
├─ tsconfig.build.json      # TypeScript 編譯設定
└─ README.md                # 專案說明文件
```
### 重要檔案說明

#### 核心目錄
- **dist/**：TypeScript 編譯後的 JavaScript 檔案輸出目錄
- **node_modules/**：npm 安裝的相依套件存放處
- **src/**：專案原始碼目錄，所有的業務邏輯都在這裡
- **test/**：端對端（E2E）測試檔案目錄

#### 設定檔案
- **.eslintrc.js**：ESLint 設定，用於規範程式碼風格和品質
- **.gitignore**：Git 版本控制忽略清單，避免提交不必要的檔案
- **.prettierrc**：Prettier 設定，用於統一程式碼格式
- **nest-cli.json**：Nest CLI 設定，定義專案結構和編譯選項
- **package.json**：專案資訊、相依套件清單、npm scripts 等
- **package-lock.json**：鎖定相依套件的確切版本，確保團隊成員使用相同版本
- **tsconfig.json**：TypeScript 編譯器設定
- **tsconfig.build.json**：生產環境的 TypeScript 編譯設定（繼承自 tsconfig.json）
## 核心程式碼解析

> **注意**：這邊會簡單帶過核心概念，後續章節會針對各功能做詳細說明。

在 `src` 資料夾中，撇除測試用的 `app.controller.spec.ts` 外，主要有四個核心檔案：

### 1. 應用程式進入點（main.ts）
`main.ts` 是整個應用程式的進入點，負責啟動 Nest 應用：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```
**程式碼說明：**
- 使用非同步的 `bootstrap` 函式作為載入函式
- `NestFactory.create(AppModule)` 建立 Nest 應用程式實例
- `app.listen(3000)` 在指定的 port 啟動 HTTP 伺服器

> **提醒**：可以透過環境變數或設定檔來動態設定 port

### 2. 根模組（app.module.ts）
`app.module.ts` 定義應用程式的根模組，是所有其他模組的進入點：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],        // 匯入其他模組
  controllers: [AppController],  // 註冊控制器
  providers: [AppService],       // 註冊服務提供者
})
export class AppModule {}
```
**程式碼說明：**
- 使用 `@Module()` 裝飾器定義模組
- **imports**：匯入其他模組（目前為空，之後可加入如 DatabaseModule、AuthModule 等）
- **controllers**：註冊此模組的控制器
- **providers**：註冊服務提供者（Services、Repositories 等）
- **exports**：（選用）匯出供其他模組使用的 providers

### 3. 控制器（app.controller.ts）
`app.controller.ts` 是註冊於根模組的控制器，負責處理 HTTP 請求：

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```
**程式碼說明：**
- `@Controller()` 裝飾器定義這是一個控制器類別
- `@Get()` 裝飾器定義 HTTP GET 請求的處理方法
- 透過 constructor 進行**依賴注入**，將 `AppService` 注入到控制器中
- `private readonly` 確保服務實例不會被修改

### 4. 服務（app.service.ts）
`app.service.ts` 是註冊於根模組的服務，負責處理業務邏輯：

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```
**程式碼說明：**
- `@Injectable()` 裝飾器標記這個類別可以被注入到其他類別中
- Service 負責處理業務邏輯、資料庫操作、外部 API 呼叫等
- 在 Nest 中，所有可注入的類別都稱為 **Provider**

### Provider 的類型
Nest 中的 Provider 不只有 Service，還包括：
- **Services**：處理業務邏輯
- **Repositories**：處理資料存取
- **Factories**：動態建立物件
- **Helpers**：提供輔助功能
- **其他任何可注入的類別**

## 小結

透過本章節，我們學習了：
1. **NestJS 的核心概念**：模組化架構、依賴注入、MVC 模式
2. **基本組成要素**：Module、Controller、Service、Provider
3. **如何建立第一個 Nest 應用**：安裝 CLI、建立專案、啟動應用
4. **專案結構**：了解各個檔案和資料夾的用途
5. **核心程式碼**：main.ts、app.module.ts、app.controller.ts、app.service.ts 的作用

Nest 提供高度的模組化設計，透過將 Controller 與 Service 定義好並放入對應的 Module，再像拼拼圖一樣把相關模組關聯起來，就可以建立起：
- **易維護**：清晰的架構和職責分離
- **低耦合**：透過依賴注入實現鬆耦合
- **易擴展**：模組化設計便於新增功能
- **可測試**：每個元件都可以獨立測試

搭配官方的 Nest CLI 工具，可以大幅提升開發效率！下一章節我們將深入探討 Controller 的使用方式。