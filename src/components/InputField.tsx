import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    theme: {
        label: string;
        input: string;
    };
    value: string | number;
    onChange: (value: any) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange, placeholder, theme, ...props }) => {
    // Treat 'number' inputs as 'text' with 'decimal' input mode to allow reliable decimal entry in React
    const inputType = type === 'number' ? 'text' : type;
    const inputMode = type === 'number' ? 'decimal' : undefined;

    return (
        <div className="mb-4">
            <label className={`block text-xs font-semibold uppercase tracking-wider ${theme.label} mb-1.5`}>{label}</label>
            <input
                type={inputType}
                inputMode={inputMode}
                value={value}
                onChange={(e) => {
                    // Allow only valid numbers/decimals
                    if (type === 'number') {
                        const val = e.target.value;
                        if (val === '' || /^-?\d*\.?\d*$/.test(val)) {
                            onChange(val);
                        }
                    } else {
                        onChange(e.target.value);
                    }
                }}
                placeholder={placeholder}
                className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 transition-all ${theme.input}`}
                {...props}
            />
        </div>
    );
};
