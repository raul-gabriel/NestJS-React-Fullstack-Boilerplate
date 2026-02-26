import React from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';


interface InputFieldProps {
  name: string; // Agregamos `name` como el campo requerido
  type?:'text' | 'email' | 'tel' | 'number' | 'password' | 'date' | 'time';
  register: UseFormRegisterReturn;
  error?: FieldError;
  label?: string; // Opcional
  placeholder?: string; // Opcional
  style?:string;
  className?:string;
  disabled?:boolean;

}

const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const InputField: React.FC<InputFieldProps> = ({ name, type = 'text', register, error, label, placeholder,style,className,disabled }) => (
  <div className="mb-4">
    <label className="block font-medium text-[14px] ">{label || capitalizeFirstLetter(name)}</label>
    <input
      type={type}
      step={type === "number" ? "any" : undefined}
      {...register}
      placeholder={placeholder || `Ingresa ${name.toLowerCase()}`}
      className={` inputField_full  mt-0 mb-0 ${error ? 'border-colorError' : 'border-gray-300 '} ${style} ${className}`}
      disabled={disabled}
    />
    {error && <p className="text-colorError text-[12px] mt-0">{error.message}</p>}
  </div>
);

export default InputField;
