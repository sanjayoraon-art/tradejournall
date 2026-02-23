# 🚀 Trade Journal Pro - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Firebase Account** - [Get started](https://firebase.google.com/)
4. **Google Gemini API Key** - [Get API key](https://makersuite.google.com/app/apikey)

## Step 1: Verify Node.js Installation

Open a terminal/PowerShell and run:

```bash
node -v
npm -v
```

You should see version numbers for both commands.

## Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd C:\Users\User\.gemini\antigravity\scratch\trade-journal
npm install
```

This will install:
- React & React DOM
- Firebase SDK
- Lucide React Icons
- Tailwind CSS
- Vite (build tool)
- TypeScript

## Step 3: Configure Environment Variables

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Anonymous sign-in
4. Enable **Firestore Database** → Start in test mode
5. Go to Project Settings → General → Your apps
6. Copy your Firebase configuration object

### 3.2 Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 3.3 Create .env File

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Or on Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3.4 Fill in Environment Variables

Open `.env` and add your credentials:

```env
# Your Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Your Firebase Config (as JSON string - keep it on one line)
VITE_FIREBASE_CONFIG={"apiKey":"your_api_key","authDomain":"your-app.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-app.appspot.com","messagingSenderId":"123456789","appId":"1:123456789:web:abcdef"}

# Your App ID (can be any unique identifier)
VITE_APP_ID=trade-journal-pro

# Optional: Initial auth token (leave empty for anonymous auth)
VITE_INITIAL_AUTH_TOKEN=
```

**Important:** The `VITE_FIREBASE_CONFIG` must be a valid JSON string on a single line.

## Step 4: Run the Development Server

Start the application:

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

## Step 5: Test the Application

### Test Features:

1. **Dashboard** - View your trading statistics
2. **Add Trade** - Log a new trade manually
3. **AI Screenshot Analysis** - Upload a trading screenshot
4. **AI Coach** - Chat with the AI about your performance
5. **Risk Calculator** - Calculate position sizes
6. **Performance Metrics** - View advanced analytics

## Step 6: Build for Production (Optional)

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` folder.

To preview the production build:

```bash
npm run preview
```

---

## 🔧 Troubleshooting

### Issue: "npm is not recognized"
**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Firebase connection errors
**Solution:** 
- Verify your Firebase config in `.env`
- Check that Firestore and Authentication are enabled
- Ensure the JSON string is properly formatted (no line breaks)

### Issue: Gemini API errors
**Solution:**
- Verify your API key is correct
- Check your API quota at [Google AI Studio](https://makersuite.google.com/)
- Ensure you're using the correct model name

### Issue: "Module not found" errors
**Solution:** Run `npm install` again to ensure all dependencies are installed

### Issue: Tailwind styles not working
**Solution:** 
- Ensure `tailwind.config.js` and `postcss.config.js` exist
- Restart the dev server (`npm run dev`)

---

## 📱 Features Overview

### 1. Dashboard
- Total P&L with dynamic colors
- Win rate percentage
- Total trades count
- Equity curve visualization

### 2. AI Screenshot Analysis
- Upload trading screenshots
- Automatic data extraction (Symbol, Entry, Exit, P&L)
- Pre-filled form for review

### 3. Trade Management
- Manual trade entry
- Favorites filtering
- Search functionality
- Delete trades
- Detailed trade history

### 4. AI Trading Coach
- Context-aware chat
- Performance insights
- Strategy recommendations
- Psychology analysis

### 5. Performance Metrics
- Sharpe Ratio
- Max Drawdown
- Risk-Reward Ratio
- Expectancy (Avg P&L)
- Strategy breakdown charts
- Monthly P&L charts

### 6. Risk Calculator
- Position size calculator
- Risk percentage input
- Stop loss/take profit calculations

### 7. Profile & Settings
- Dark/Light mode toggle
- Profile customization
- Data export (JSON)
- Privacy & Terms pages

---

## 🎨 Design Features

- **Bloomberg-meets-Modern-SaaS** aesthetic
- **Glassmorphism** headers
- **Smooth transitions** and animations
- **Mobile-first** responsive design
- **Professional color palette**:
  - Deep Grays (#111827)
  - Emerald Green (profit)
  - Rose Red (loss)
  - Electric Blue/Yellow (highlights)

---

## 📊 Data Structure

### Trade Object
```typescript
{
  symbol: string;
  date: string;
  entryPrice: number;
  exitPrice: number;
  pnlAmount: number;
  resultType: 'Profit' | 'Loss';
  tradeType: 'Long' | 'Short';
  currency: string;
  marketConcept: string; // Strategy
  tradeStyle: string; // Scalping, Day Trade, etc.
  psychology: string; // Mental state
  note: string;
  isFavorite: boolean;
  timestamp: number;
}
```

---

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Keep your Firebase and Gemini API keys secure
- Use Firebase Security Rules in production
- Enable proper authentication in production

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

---

## 🎯 Next Steps

1. ✅ Install Node.js and npm
2. ✅ Run `npm install`
3. ✅ Configure `.env` file
4. ✅ Run `npm run dev`
5. ✅ Start logging trades!

---

**Happy Trading! 📈**
