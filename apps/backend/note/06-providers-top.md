# NestJS Provider 深度解析：依賴注入與實作模式

## 📚 前言

本系列文已出版成書「NestJS 基礎必學實務指南：使用強大且易擴展的 Node.js 框架打造網頁應用程式」，感謝 iT 邦幫忙與博碩文化的協助。如果對 NestJS 有興趣、覺得這個系列文對你有幫助的話，歡迎前往購書，你的支持是我最大的寫作動力！

## 🎯 學習目標

深入理解 NestJS 的 Provider 機制，掌握依賴注入概念，並學會各種 Provider 的實作模式。

## 📖 前置概念

Provider 與 Module 之間的核心機制建立在**依賴注入**的基礎上。本文將從依賴注入的概念出發，深入探討 NestJS 如何實現這個機制，並詳細說明各種 Provider 的使用方式。

## 🔧 依賴注入 (Dependency Injection)

### 什麼是依賴注入？

依賴注入是一種設計模式，透過此方式可以大幅降低程式碼耦合度，提升程式的可測試性和可維護性。

### 實際範例

讓我們透過一個簡單的例子來理解依賴注入：

```typescript
class CPU {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Computer {
  cpu: CPU;
  constructor(cpu: CPU) {
    this.cpu = cpu;
  }
}
```

可以看到 Computer 在建構的時候需要帶入類別為 CPU 的參數，這樣的好處是把 CPU 的功能都歸在 CPU 裡、Computer 不需要實作 CPU 的功能，甚至抽換成不同 CPU 都十分方便：

```typescript
const i7 = new CPU('i7-11375H');
const i9 = new CPU('i9-10885H');
const PC1 = new Computer(i7);
const PC2 = new Computer(i9);
```

## 🏗️ Nest 的依賴注入機制

不過依賴注入跟 Provider 還有 Module 有什麼關係呢？仔細回想一下，當我們在 Controller 的 constructor 注入了 Service 後，沒有使用到任何 new 卻可以直接使用。這裡以 app.controller.ts 為例：

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

沒有經過實例化那這個實例從哪裡來的？前面有說過當 Module 建立起來的同時，會把 providers 裡面的項目實例化，而我們注入的 Service 就是透過這樣的方式建立實例的，也就是說有個機制在維護這些實例，這個機制叫 **控制反轉容器 (IoC Container)**。

### Token 機制

控制反轉容器是透過 token 來找出對應項目的，有點類似 key/value 的概念，這時候可能會想說：我沒有指定 token 是什麼 Nest 怎麼知道對應的實例是哪一個？事實上，我們寫 providers 的時候就已經指定了。這裡以 app.module.ts 為例：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
```

奇怪，只是寫了一個 AppService 就指定了 token？沒錯，因為那是縮寫，把它展開來的話會像這樣：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    { provide: AppService, useClass: AppService }
  ],
})
export class AppModule {}
```

可以看到變成了一個物件，該物件的 provide 即 token，useClass 則是指定使用的 class 為何，進而建立實例。

## 📦 Provider 類型

Provider 透過控制反轉容器做實例的管理，可以很方便且有效地使用這些 Provider，而 Provider 大致上可以分成兩種：

### 1️⃣ 標準 Provider

這是最簡單的作法，也是大多數 Service 的作法，在 class 上添加 `@Injectable` 讓 Nest 知道這個 class 是可以由控制反轉容器管理的。通常 Service 會使用下方指令來產生：

```bash
nest generate service <SERVICE_NAME>
```

> 注意：`<SERVICE_NAME>` 可以含有路徑，如：`features/todo`，這樣就會在 src 資料夾下建立該路徑並含有 Service。

這裡以 app.service.ts 為例：

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
```

在 Module 中，只需要於 providers 中聲明該 Service 即可。這裡以 app.module.ts 為例：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

如果喜歡寫展開式也是可以：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: AppService
    }
  ],
})
export class AppModule {}
```

### 2️⃣ 自訂 Provider

如果覺得標準 Provider 無法滿足需求，如：

- 想自行建立一個實例，而不是透過 Nest 建立
- 想要在其他依賴項目中重用實例
- 使用模擬版本的 class 進行覆寫，以便做測試

沒關係，Nest 提供了多種方式來自訂 Provider，都是透過展開式進行定義：

## 🛠️ 自訂 Provider 實作模式

### 1. Value Provider

這類型的 Provider 主要是用來：

- 提供常數 (Constant)
- 將外部函式庫注入到控制反轉容器
- 將 class 抽換成特定的模擬版本

那要如何使用呢？在展開式中使用 `useValue` 來配置。這裡以 app.module.ts 為例：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useValue: {
        name: 'HAO'
      }
    }
  ],
})
export class AppModule {}
```

修改 app.controller.ts 來查看 token 為 AppService 的內容為何：

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(this.appService);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

會發現注入的 AppService 變成我們指定的物件，會在終端機看到結果：

```json
{ name: 'HAO' }
```

### 2. 非類別型 Token

事實上，Provider 的 token 不一定要使用 class，Nest 允許使用以下項目：

- string
- symbol
- enum

這邊同樣以 app.module.ts 為例，我們指定 token 為字串 `HANDSOME_MAN`，並使用 `HAO` 作為值：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'HANDSOME_MAN',
      useValue: 'HAO'
    }
  ],
})
export class AppModule {}
```

在注入的部分需要特別留意，要使用 `@Inject(token?: string)` 裝飾器來取得。這裡以 app.controller.ts 為例：

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('HANDSOME_MAN') private readonly handsome_man: string
  ) {
    console.log(this.handsome_man);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

會發現注入的 HANDSOME_MAN 即為指定的值，在終端機會看到：

```text
HAO
```

> 💡 **提醒**：通常會把這類型的 token 名稱放在獨立的檔案裡，好處是當有其他地方需要使用的時候，可以直接取用該檔案裡的內容，而不需要再重寫一次 token 的名稱。

### 3. Class Provider

這類型的 Provider 最典型的用法就是讓 token 指定為抽象類別，並使用 `useClass` 來根據不同環境提供不同的實作類別。這裡以 app.module.ts 為例：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './features/todo/todo.module';
import { TodoService } from './features/todo/todo.service';

class HandSomeMan {
  name = 'HAO';
}

class TestHandSomeMan {
  name = 'HAO';
}

@Module({
  imports: [TodoModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: TodoService,
      useClass: process.env.NODE_ENV === 'production' ? HandSomeMan : TestHandSomeMan
    }
  ],
})
export class AppModule {}
```

> 💡 **提醒**：如果沒有建立 TodoService 的話，先建立 TodoModule 並將其匯出；如果已經建立的話，也需要留意有沒有匯出呦。

稍微改寫一下 app.controller.ts：

```typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TodoService } from './features/todo/todo.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly todoService: TodoService
  ) {
    console.log(this.todoService);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

如果環境變數 NODE_ENV 不等於 production 的話，會在終端機看到下方結果：

```text
TestHandSomeMan { name: 'HAO' }
```

### 4. Factory Provider

這類型的 Provider 使用工廠模式讓 Provider 更加靈活，透過 **注入其他依賴** 來變化出不同的實例，是很重要的功能。使用 `useFactory` 來指定工廠模式的函數，並透過 `inject` 來注入其他依賴。以 app.module.ts 為例：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

class MessageBox {
  message: string;
  constructor(message: string) {
    this.message = message;
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'MESSAGE_BOX',
      useFactory: (appService: AppService) => {
        const message = appService.getHello();
        return new MessageBox(message);
      },
      inject: [AppService]
    }
  ],
})
export class AppModule {}
```

稍微修改一下 app.controller.ts：

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('MESSAGE_BOX') private readonly messageBox
  ) {
    console.log(this.messageBox);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

會在終端機看到下方結果：

```text
MessageBox { message: 'Hello World!' }
```

### 5. Alias Provider

這個 Provider 主要就是替已經存在的 Provider 取別名，使用 `useExisting` 來指定要使用哪個 Provider。以 app.module.ts 為例：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'ALIAS_APP_SERVICE',
      useExisting: AppService
    }
  ],
})
export class AppModule {}
```

這樣就會把 ALIAS_APP_SERVICE 指向到 AppService 的實例。這裡修改一下 app.controller.ts 做驗證：

```typescript
import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('ALIAS_APP_SERVICE') private readonly alias: AppService
  ) {
    console.log(this.alias === this.appService); // 進行比對
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

會發現兩個參數是相等的，在終端機看到的結果為：

```text
true
```

## 📊 Provider 類型總覽

| Provider 類型 | 使用方法 | 使用場景 |
|--------------|----------|----------|
| **標準 Provider** | `@Injectable()` | 一般 Service 類別 |
| **Value Provider** | `useValue` | 提供常數、配置值 |
| **Class Provider** | `useClass` | 根據條件切換實作 |
| **Factory Provider** | `useFactory` | 複雜初始化邏輯 |
| **Alias Provider** | `useExisting` | 為現有 Provider 建立別名 |

## 🎯 小結

Provider 是非常重要的機制，要用一篇的幅度來介紹它實在不太夠，剩下的部分會在下篇做說明，這裡就先給大家今天的懶人包：

### ✅ 重點回顧

1. **Provider 與 Module 之間有依賴注入機制的關係**
2. **透過控制反轉容器管理 Provider 實例**
3. **Provider 分為標準 Provider 與自訂 Provider**
4. **自訂 Provider 使用展開式**
5. **有四種方式提供自訂 Provider：useValue、useClass、useFactory、useExisting**
6. **Provider 的 token 可以是：string、symbol、enum**

### 🚀 下一步

下一篇將深入探討 Provider 的進階使用，包括：

- 非同步 Provider
- 動態模組
- Provider 作用域
- 循環依賴處理
