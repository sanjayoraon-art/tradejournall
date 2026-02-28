

const getApiKey = () => {
    return localStorage.getItem('geminiApiKey') || import.meta.env.VITE_GEMINI_API_KEY || "";
};

const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
const getApiUrl = () => `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${getApiKey()}`;
const MAX_RETRIES = 5;

interface ApiOptions extends RequestInit {
    body?: string;
}

const exponentialBackoffFetch = async (url: string, options: ApiOptions, retries = MAX_RETRIES): Promise<any> => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            if (response.status === 429 && retries > 0) {
                const delay = Math.pow(2, MAX_RETRIES - retries) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return exponentialBackoffFetch(url, options, retries - 1);
            }
            throw new Error(`API call failed with status: ${response.status}`);
        }
        return response.json();
    } catch (error: any) {
        if (retries > 0) {
            const delay = Math.pow(2, MAX_RETRIES - retries) * 1000 + Math.random() * 1000;
            return exponentialBackoffFetch(url, options, retries - 1);
        }
        throw new Error(error.message);
    }
};

const _tradeDataSchema = {
    type: "OBJECT",
    properties: {
        "symbol": { "type": "STRING", "description": "The ticker symbol, e.g., BTCUSDT" },
        "date": { "type": "STRING", "description": "ISO date YYYY-MM-DD" },
        "entryPrice": { "type": "NUMBER" },
        "exitPrice": { "type": "NUMBER" },
        "pnlAmountValue": { "type": "NUMBER", "description": "The absolute profit or loss amount" },
        "resultType": { "type": "STRING", "enum": ["Profit", "Loss"] },
        "tradeType": { "type": "STRING", "enum": ["Long", "Short"] },
        "currency": { "type": "STRING", "description": "3-letter currency code" },
        "currencySymbol": { "type": "STRING", "description": "The currency symbol, e.g., $, ₹, €, £" },
        "note": { "type": "STRING", "description": "Brief summary of the trade" }
    },
    required: ["symbol", "entryPrice", "exitPrice", "pnlAmountValue", "resultType", "tradeType"]
};

export const analyzeTradeScreenshot = async (base64Image: string): Promise<any> => {
    const userQuery = "Carefully extract trading data from this screenshot. Find the Symbol, Entry Price, Exit Price, Net Profit/Loss amount, Direction (Long/Short), Result (Profit/Loss), and the Currency Symbol (e.g. $, ₹). Provide the data in strict JSON format according to the schema.";
    const payload = {
        contents: [{ role: "user", parts: [{ text: userQuery }, { inlineData: { mimeType: "image/jpeg", data: base64Image } }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: _tradeDataSchema,
            temperature: 0.1
        }
    };
    const result = await exponentialBackoffFetch(getApiUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonText) throw new Error("AI analysis failed.");
    return JSON.parse(jsonText);
};

export { exponentialBackoffFetch, getApiUrl as API_URL };
