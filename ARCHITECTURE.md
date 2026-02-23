# 🏗️ Trade Journal Pro - Architecture Overview

## System Architecture

```mermaid
graph TB
    subgraph "Frontend - React + TypeScript"
        A[User Interface]
        B[App.tsx - Main Controller]
        C[Screens]
        D[Components]
        E[Utils]
    end
    
    subgraph "Backend Services"
        F[Firebase Auth]
        G[Firestore Database]
        H[Gemini AI API]
    end
    
    A --> B
    B --> C
    B --> D
    C --> D
    C --> E
    D --> E
    
    B --> F
    B --> G
    E --> H
    
    F -.Anonymous Auth.-> B
    G -.Real-time Sync.-> B
    H -.AI Analysis.-> E
```

---

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx]
    
    App --> Splash[Splash Screen]
    App --> Header[Header Component]
    App --> Router[Screen Router]
    App --> BottomNav[Bottom Navigation]
    App --> Modals[Modals]
    
    Router --> Dashboard[Dashboard Screen]
    Router --> TradeList[Trade List Screen]
    Router --> AddTrade[Add Trade Screen]
    Router --> RiskCalc[Risk Calculator Screen]
    Router --> Metrics[Performance Metrics Screen]
    Router --> Profile[Profile Screen]
    Router --> AiChat[AI Chat Screen]
    Router --> Info[Information Screen]
    
    Dashboard --> Stats[Stats Cards]
    Dashboard --> Charts[Charts Components]
    
    Charts --> Candlestick[Candlestick Chart]
    Charts --> BarChart[Bar Chart]
    Charts --> ProgressBar[Progress Bar]
    
    AddTrade --> InputFields[Input Fields]
    AddTrade --> AiUpload[AI Screenshot Upload]
    AddTrade --> BannerAd[Banner Ad]
    
    TradeList --> TradeModal[Trade Details Modal]
    
    Modals --> ConfirmModal[Confirmation Modal]
    Modals --> AdOverlay[Ad Overlay]
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Firebase
    participant Gemini
    
    User->>App: Opens Application
    App->>Firebase: Anonymous Sign-In
    Firebase-->>App: User ID
    App->>Firebase: Subscribe to Trades
    Firebase-->>App: Real-time Trade Data
    App->>App: Calculate Metrics
    App-->>User: Display Dashboard
    
    User->>App: Upload Screenshot
    App->>Gemini: Analyze Image
    Gemini-->>App: Extracted Trade Data
    App-->>User: Pre-filled Form
    
    User->>App: Submit Trade
    App->>Firebase: Save Trade
    Firebase-->>App: Update Confirmation
    App->>App: Recalculate Metrics
    App-->>User: Updated Dashboard
    
    User->>App: Ask AI Coach
    App->>Gemini: Send Query + Context
    Gemini-->>App: AI Response
    App-->>User: Display Answer
```

---

## State Management

```mermaid
graph LR
    subgraph "App State"
        A[userId]
        B[trades]
        C[performanceStats]
        D[theme]
        E[currentScreen]
        F[chatMessages]
    end
    
    subgraph "Derived State"
        G[totalPnl]
        H[winRate]
        I[metricsCards]
        J[chartData]
    end
    
    subgraph "Firebase Listeners"
        K[onAuthStateChanged]
        L[onSnapshot trades]
    end
    
    K --> A
    L --> B
    B --> C
    C --> G
    C --> H
    C --> I
    C --> J
```

---

## File Dependencies

```mermaid
graph TD
    Main[main.tsx]
    App[App.tsx]
    
    Main --> App
    
    App --> Screens[Screens/*]
    App --> Components[Components/*]
    App --> Utils[Utils/*]
    App --> Types[types.ts]
    
    Screens --> Components
    Screens --> Utils
    Screens --> Types
    
    Components --> Utils
    Components --> Types
    
    Utils --> Types
    
    Utils --> Firebase[firebase.ts]
    Utils --> API[api.ts]
    Utils --> Analytics[analytics.ts]
    Utils --> Helpers[helpers.ts]
```

---

## API Integration Flow

```mermaid
sequenceDiagram
    participant Component
    participant API Utils
    participant Gemini API
    
    Component->>API Utils: analyzeTradeScreenshot(base64)
    API Utils->>Gemini API: POST /generateContent
    
    alt Success
        Gemini API-->>API Utils: JSON Response
        API Utils-->>Component: Parsed Trade Data
    else Rate Limit (429)
        Gemini API-->>API Utils: 429 Error
        API Utils->>API Utils: Wait (Exponential Backoff)
        API Utils->>Gemini API: Retry Request
    else Other Error
        Gemini API-->>API Utils: Error
        API Utils-->>Component: Throw Error
    end
```

---

## Firebase Data Structure

```mermaid
graph TD
    Root[Firestore Root]
    
    Root --> Artifacts[artifacts/]
    Artifacts --> AppId["{appId}/"]
    AppId --> Users[users/]
    Users --> UserId["{userId}/"]
    
    UserId --> Trades[trades/]
    UserId --> Profile[profile/]
    
    Trades --> Trade1["{tradeId}"]
    Trade1 --> TradeData["symbol, date, entryPrice,<br/>exitPrice, pnlAmount, etc."]
    
    Profile --> Info[info]
    Info --> ProfileData["name, image"]
```

---

## Performance Metrics Calculation Flow

```mermaid
graph LR
    Trades[Trade Data]
    
    Trades --> Extract[Extract P&L Values]
    Extract --> Aggregate[Aggregate Data]
    
    Aggregate --> TotalPnl[Total P&L]
    Aggregate --> WinRate[Win Rate %]
    Aggregate --> Expectancy[Expectancy]
    
    Aggregate --> Advanced[Advanced Metrics]
    Advanced --> Sharpe[Sharpe Ratio]
    Advanced --> Drawdown[Max Drawdown]
    Advanced --> RiskReward[Risk-Reward Ratio]
    
    Aggregate --> Charts[Chart Data]
    Charts --> Strategy[By Strategy]
    Charts --> Monthly[Monthly P&L]
    Charts --> Equity[Equity Curve]
    
    TotalPnl --> Stats[Performance Stats]
    WinRate --> Stats
    Expectancy --> Stats
    Sharpe --> Stats
    Drawdown --> Stats
    RiskReward --> Stats
    Strategy --> Stats
    Monthly --> Stats
    Equity --> Stats
```

---

## Screen Navigation Flow

```mermaid
graph TD
    Start[App Launch]
    Start --> Splash[Splash Screen 2s]
    Splash --> Auth{Authenticated?}
    
    Auth -->|Yes| Dashboard[Dashboard]
    Auth -->|No| Loading[Loading...]
    Loading --> Auth
    
    Dashboard --> Nav{User Action}
    
    Nav -->|View Trades| TradeList[Trade List]
    Nav -->|Add Trade| AddTrade[Add New Trade]
    Nav -->|Calculator| RiskCalc[Risk Calculator]
    Nav -->|Metrics| Metrics[Performance Metrics]
    Nav -->|Profile| Profile[Profile]
    Nav -->|AI Chat| AiChat[AI Chat]
    
    TradeList --> Dashboard
    AddTrade --> Dashboard
    RiskCalc --> Dashboard
    Metrics --> Dashboard
    Profile --> Info[Info Pages]
    Info --> Profile
    AiChat --> Dashboard
```

---

## Theme System

```mermaid
graph LR
    ThemeState[isDarkMode State]
    
    ThemeState -->|true| Dark[Dark Theme]
    ThemeState -->|false| Light[Light Theme]
    
    Dark --> DarkColors["bg: gray-900<br/>text: white<br/>card: gray-800<br/>border: gray-700"]
    
    Light --> LightColors["bg: gray-100<br/>text: gray-900<br/>card: white<br/>border: gray-200"]
    
    DarkColors --> Apply[Apply to Components]
    LightColors --> Apply
```

---

## AI Features Architecture

```mermaid
graph TD
    subgraph "AI Screenshot Analysis"
        A1[User Uploads Image]
        A2[Convert to Base64]
        A3[Send to Gemini API]
        A4[Extract Structured Data]
        A5[Pre-fill Form]
    end
    
    subgraph "AI Trading Coach"
        B1[User Asks Question]
        B2[Gather Performance Context]
        B3[Build Prompt]
        B4[Send to Gemini API]
        B5[Display Response]
    end
    
    A1 --> A2 --> A3 --> A4 --> A5
    B1 --> B2 --> B3 --> B4 --> B5
    
    A3 -.Uses.-> Schema[JSON Schema]
    B3 -.Uses.-> Context[Stats Summary]
```

---

## Build & Deployment Pipeline

```mermaid
graph LR
    Dev[Development]
    Build[Build Process]
    Dist[Distribution]
    Deploy[Deployment]
    
    Dev -->|npm run dev| Vite[Vite Dev Server]
    Dev -->|npm run build| Build
    
    Build --> TypeScript[TypeScript Compilation]
    Build --> Tailwind[Tailwind CSS Processing]
    Build --> Bundling[Code Bundling]
    
    TypeScript --> Dist
    Tailwind --> Dist
    Bundling --> Dist
    
    Dist --> Deploy
    
    Deploy --> Vercel[Vercel]
    Deploy --> Netlify[Netlify]
    Deploy --> Firebase[Firebase Hosting]
    Deploy --> Other[Other Platforms]
```

---

## Error Handling Strategy

```mermaid
graph TD
    Error[Error Occurs]
    
    Error --> Type{Error Type}
    
    Type -->|Network| Retry[Exponential Backoff Retry]
    Type -->|Auth| ReAuth[Re-authenticate]
    Type -->|Validation| UserFeedback[Show Validation Message]
    Type -->|API Limit| Wait[Wait & Retry]
    Type -->|Unknown| Fallback[Fallback to Manual Entry]
    
    Retry --> Success{Success?}
    Success -->|Yes| Continue[Continue]
    Success -->|No| UserFeedback
    
    ReAuth --> Continue
    UserFeedback --> Continue
    Wait --> Continue
    Fallback --> Continue
```

---

## Security Architecture

```mermaid
graph TD
    User[User]
    
    User --> Frontend[Frontend App]
    Frontend --> Auth[Firebase Auth]
    
    Auth --> Anonymous[Anonymous Sign-In]
    Auth --> Custom[Custom Token]
    
    Anonymous --> Firestore[Firestore]
    Custom --> Firestore
    
    Firestore --> Rules[Security Rules]
    Rules --> Check{Authenticated?}
    
    Check -->|Yes| Allow[Allow Access]
    Check -->|No| Deny[Deny Access]
    
    Frontend --> Gemini[Gemini API]
    Gemini --> APIKey[API Key Validation]
```

---

## Performance Optimization

```mermaid
graph LR
    subgraph "Frontend Optimizations"
        A[Pure CSS Charts]
        B[Efficient Re-renders]
        C[Lazy Loading]
    end
    
    subgraph "Backend Optimizations"
        D[Real-time Listeners]
        E[Indexed Queries]
        F[Batched Writes]
    end
    
    subgraph "API Optimizations"
        G[Exponential Backoff]
        H[Request Caching]
        I[Structured Output]
    end
    
    A --> Fast[Fast Performance]
    B --> Fast
    C --> Fast
    D --> Fast
    E --> Fast
    F --> Fast
    G --> Fast
    H --> Fast
    I --> Fast
```

---

## Responsive Design Breakpoints

```mermaid
graph LR
    Mobile[Mobile First]
    
    Mobile --> Base["Base: < 640px<br/>(Default)"]
    Base --> SM["sm: ≥ 640px<br/>(Small tablets)"]
    SM --> MD["md: ≥ 768px<br/>(Tablets)"]
    MD --> LG["lg: ≥ 1024px<br/>(Desktops)"]
    LG --> XL["xl: ≥ 1280px<br/>(Large screens)"]
    
    Base -.Max Width.-> MaxW["max-w-md<br/>(448px)"]
```

---

## Key Technologies Integration

```mermaid
graph TD
    App[Trade Journal Pro]
    
    App --> React[React 18]
    App --> TS[TypeScript]
    App --> Tailwind[Tailwind CSS]
    App --> Vite[Vite]
    
    React --> Hooks[Hooks API]
    TS --> Types[Type Safety]
    Tailwind --> Utility[Utility Classes]
    Vite --> HMR[Hot Module Reload]
    
    App --> Firebase[Firebase SDK]
    App --> Gemini[Gemini API]
    App --> Lucide[Lucide Icons]
    
    Firebase --> Auth[Authentication]
    Firebase --> DB[Firestore]
    Gemini --> Vision[Image Analysis]
    Gemini --> Chat[Chat Completion]
```

---

## Summary

This architecture provides:

- ✅ **Modular Design** - Separated concerns (screens, components, utils)
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Real-time Data** - Firebase listeners for instant updates
- ✅ **AI Integration** - Gemini API for analysis and coaching
- ✅ **Responsive UI** - Mobile-first Tailwind CSS
- ✅ **Error Handling** - Comprehensive error recovery
- ✅ **Performance** - Optimized rendering and calculations
- ✅ **Security** - Firebase authentication and rules
- ✅ **Scalability** - Clean architecture for future growth

**The application is production-ready and follows industry best practices!** 🚀
