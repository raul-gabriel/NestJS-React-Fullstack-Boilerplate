
import React from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaFieldProps {
    name: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    label?: string;
    placeholder?: string;
    style?: string;
    className?: string;
    classCard?: string;
    disabled?: boolean;
    rows?: number;
}

const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const TextAreaField: React.FC<TextAreaFieldProps> = ({ name, register, error, label, placeholder, style, className, classCard, disabled, rows = 4 }) => (
    <div className={`mb-4 ${classCard ?? ''}`}>
        <label className="block font-medium text-[14px]">{label || capitalizeFirstLetter(name)}</label>
        <textarea
            {...register}
            rows={rows}
            placeholder={placeholder || `Ingresa ${name.toLowerCase()}`}
            className={`inputField_full mt-0 mb-0 resize-none ${error ? 'border-colorError' : 'border-gray-300'} ${style ?? ''} ${className ?? ''}`}
            disabled={disabled}
        />
        {error && <p className="text-colorError text-[12px] mt-0">{error.message}</p>}
    </div>
);

export default TextAreaField;