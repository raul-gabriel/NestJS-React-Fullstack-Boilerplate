import React from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface SelectFieldProps {
  className?: string;
  name: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  label?: string;
  options: { value: string; label: string }[]; // Opciones para el select
}

const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const SelectField: React.FC<SelectFieldProps> = ({ name, register, error, label, options, className }) => (
  <>
    <label className="block text-[14px]  font-medium">{label || capitalizeFirstLetter(name)}</label>
    <select {...register} className={`inputField_full mb-0  mt-0 ${error ? 'border-colorError' : 'border-gray-300'}  ${className}`}>
      <option value="">Seleccione {label || capitalizeFirstLetter(name)}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-colorError text-[12px]  mt-0">{error.message}</p>}
  </>
);

export default SelectField;
