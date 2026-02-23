# Trade Journal App

## Setup Instructions

### 1. Prerequisites
Ensure you have **Node.js** and **npm** installed.
Verify by running:
```bash
node -v
npm -v
```

### 2. Environment Configuration
1.  Copy `.env.example` to a new file named `.env`:
    ```bash
    cp .env.example .env
    ```
2.  Open `.env` and fill in your API keys:
    - `VITE_GEMINI_API_KEY`: Your Google Gemini API key.
    - `VITE_FIREBASE_CONFIG`: Your Firebase configuration object (as a JSON string).

### 3. Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```
Open the URL shown in the terminal (usually `http://localhost:5173`) to view the app.

### 5. Building for Production
To create a production build:
```bash
npm run build
```
The output will be in the `dist/` directory.
