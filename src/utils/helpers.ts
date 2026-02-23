export const getCurrencySymbol = (currencyCode: string): string => {
    const map: Record<string, string> = {
        'USD': '$', 'EUR': '€', 'JPY': '¥', 'GBP': '£', 'INR': '₹', 'AUD': 'A$', 'CAD': 'C$',
    };
    return map[currencyCode?.toUpperCase()] || '$';
};

export const formatNumber = (num: number | string, decimals: number = 0): string => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (typeof n !== 'number' || isNaN(n)) return '0';
    return parseFloat(n.toFixed(decimals)).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
};

export const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read file'));
        }
    };
    reader.onerror = (error) => reject(error);
});
