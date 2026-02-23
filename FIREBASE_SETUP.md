# 🔥 Firebase Configuration Quick Reference

## How to Get Your Firebase Config

### Step 1: Go to Firebase Console
Visit: https://console.firebase.google.com/

### Step 2: Select/Create Your Project
- Click on your project (or create a new one)
- Click the gear icon ⚙️ → Project Settings

### Step 3: Find Your Config
1. Scroll down to "Your apps"
2. If you don't have a web app, click "Add app" → Web (</> icon)
3. Register your app with a nickname (e.g., "Trade Journal")
4. Copy the `firebaseConfig` object

### Step 4: Format for .env File

Your Firebase Console will show something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 5: Convert to Single-Line JSON String

**Remove spaces and newlines** and put it in your `.env` file:

```env
VITE_FIREBASE_CONFIG={"apiKey":"AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789012","appId":"1:123456789012:web:abcdef1234567890"}
```

**Important:** It must be on ONE line with NO spaces between the equals sign and the value.

---

## Enable Required Firebase Services

### 1. Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Anonymous** provider
5. Click **Save**

### 2. Enable Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Enable**

### 3. Configure Firestore Security Rules (Optional for Development)

For development/testing, you can use these permissive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ Warning:** These rules allow any authenticated user to read/write. Use stricter rules in production!

---

## Complete .env File Example

```env
# Gemini API Key (get from https://makersuite.google.com/app/apikey)
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase Config (single line JSON string)
VITE_FIREBASE_CONFIG={"apiKey":"AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789012","appId":"1:123456789012:web:abcdef1234567890"}

# App ID (can be any unique string)
VITE_APP_ID=trade-journal-pro

# Optional: Leave empty for anonymous auth
VITE_INITIAL_AUTH_TOKEN=
```

---

## Testing Your Configuration

After setting up your `.env` file:

1. Save the file
2. Restart your dev server (if running)
3. Run: `npm run dev`
4. Open the app in your browser
5. Check the browser console for any errors

### Common Errors:

**"Firebase configuration not found"**
- Check that `.env` file exists in the project root
- Verify the variable name is exactly `VITE_FIREBASE_CONFIG`
- Ensure there are no spaces around the `=` sign

**"Firebase: Error (auth/invalid-api-key)"**
- Your API key is incorrect
- Copy it again from Firebase Console

**"Firebase: Error (auth/project-not-found)"**
- Your project ID is incorrect
- Verify the entire config object

---

## Firestore Data Structure

The app will automatically create this structure:

```
firestore/
└── artifacts/
    └── {APP_ID}/
        └── users/
            └── {USER_ID}/
                ├── trades/
                │   └── {TRADE_ID}
                │       ├── symbol: "BTCUSDT"
                │       ├── date: "2024-01-15"
                │       ├── entryPrice: 45000
                │       ├── exitPrice: 46000
                │       ├── pnlAmount: 1000
                │       ├── resultType: "Profit"
                │       ├── tradeType: "Long"
                │       ├── currency: "USD"
                │       ├── marketConcept: "Breakout"
                │       ├── tradeStyle: "Day Trade"
                │       ├── psychology: "Disciplined"
                │       ├── note: "Clean breakout setup"
                │       ├── isFavorite: false
                │       └── timestamp: 1705334400000
                └── profile/
                    └── info
                        ├── name: "Alpha Trader"
                        └── image: "base64_image_string"
```

---

## Quick Troubleshooting

| Error | Solution |
|-------|----------|
| `VITE_FIREBASE_CONFIG is undefined` | Create `.env` file in project root |
| `JSON.parse error` | Ensure config is valid JSON on one line |
| `Permission denied` | Enable Anonymous auth in Firebase |
| `Collection not found` | Firestore will auto-create on first write |
| `API key expired` | Generate new key in Firebase Console |

---

## Security Best Practices

### For Development:
✅ Use test mode Firestore rules
✅ Use anonymous authentication
✅ Keep `.env` file in `.gitignore`

### For Production:
✅ Implement proper security rules
✅ Use email/password or OAuth authentication
✅ Set up Firebase App Check
✅ Enable rate limiting
✅ Use environment-specific configs

---

## Need Help?

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
- Gemini API: https://ai.google.dev/docs
- Project Issues: Check browser console for detailed errors

---

**You're all set! 🚀**
