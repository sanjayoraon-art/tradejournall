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

export const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange, placeholder, theme, ...props }) => (
    <div className="mb-4">
        <label className={`block text-xs font-semibold uppercase tracking-wider ${theme.label} mb-1.5`}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-500 transition-all ${theme.input}`}
            {...props}
        />
    </div>
);
