# ⚡ Quick Start Commands

## Prerequisites Check

```powershell
# Check if Node.js is installed
node -v

# Check if npm is installed
npm -v
```

**If these commands fail, install Node.js from:** https://nodejs.org/

---

## Installation (First Time Only)

```powershell
# Navigate to project directory
cd C:\Users\User\.gemini\antigravity\scratch\trade-journal

# Install all dependencies
npm install
```

---

## Environment Setup (First Time Only)

```powershell
# Copy environment template
Copy-Item .env.example .env

# Then edit .env file and add your API keys
notepad .env
```

**Required Environment Variables:**
- `VITE_GEMINI_API_KEY` - Get from https://makersuite.google.com/app/apikey
- `VITE_FIREBASE_CONFIG` - Get from https://console.firebase.google.com/
- `VITE_APP_ID` - Any unique identifier (e.g., "trade-journal-pro")

See [FIREBASE_SETUP.md](file:///C:/Users/User/.gemini/antigravity/scratch/trade-journal/FIREBASE_SETUP.md) for detailed instructions.

---

## Run Development Server

```powershell
# Start the app
npm run dev
```

**The app will be available at:** http://localhost:5173

Press `Ctrl + C` to stop the server.

---

## Build for Production

```powershell
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## Common Commands

```powershell
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Troubleshooting

### Issue: "npm is not recognized"
```powershell
# Install Node.js from https://nodejs.org/
# Restart PowerShell after installation
```

### Issue: Port 5173 already in use
```powershell
# Kill the process using the port
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Issue: Dependencies not installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: Firebase errors
```powershell
# Verify .env file exists
Test-Path .env

# Check .env content
Get-Content .env

# Ensure Firebase config is on one line with no spaces
```

---

## File Structure Quick Reference

```
trade-journal/
├── src/
│   ├── components/     # UI components
│   ├── screens/        # Full screens
│   ├── utils/          # Helper functions
│   ├── App.tsx         # Main app
│   └── main.tsx        # Entry point
├── .env               # Your API keys (create this!)
├── .env.example       # Template
├── package.json       # Dependencies
└── vite.config.ts     # Build config
```

---

## Environment Variables Template

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
VITE_APP_ID=trade-journal-pro
VITE_INITIAL_AUTH_TOKEN=
```

---

## Testing the App

After running `npm run dev`:

1. ✅ Open http://localhost:5173
2. ✅ Wait for splash screen (2 seconds)
3. ✅ Check dashboard loads
4. ✅ Try adding a trade manually
5. ✅ Test AI screenshot analysis
6. ✅ Chat with AI coach
7. ✅ View performance metrics

---

## Next Steps

1. **Install Node.js** (if not already installed)
2. **Run:** `npm install`
3. **Create:** `.env` file with your API keys
4. **Run:** `npm run dev`
5. **Open:** http://localhost:5173
6. **Start trading!** 📈

---

## Need Help?

- **Setup Guide:** [SETUP_GUIDE.md](file:///C:/Users/User/.gemini/antigravity/scratch/trade-journal/SETUP_GUIDE.md)
- **Firebase Setup:** [FIREBASE_SETUP.md](file:///C:/Users/User/.gemini/antigravity/scratch/trade-journal/FIREBASE_SETUP.md)
- **Implementation Status:** [IMPLEMENTATION_STATUS.md](file:///C:/Users/User/.gemini/antigravity/brain/a701f0ed-5c12-48d5-a9ea-18d44fb8c385/IMPLEMENTATION_STATUS.md)

---

**You're ready to go! 🚀**
