import React, { useEffect } from 'react';
import type { FieldError, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface Switcher1Props {
  label?: string;
  options: [string, string];
  name: string;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  error?: FieldError;
  className?: string;
}

const Switcher1: React.FC<Switcher1Props> = ({
  label,
  options,
  name,
  setValue,
  watch,
  error,
  className,
}) => {
  // Obtiene el valor actual del campo con un fallback
  const currentValue: string = watch(name);

  // Establecer valor inicial si está indefinido
  useEffect(() => {
    if (!currentValue) {
      setValue(name, options[0], { shouldValidate: true });
    }
  }, [currentValue, name, options, setValue]);

  // Alternar entre las dos opciones
  const handleToggle = () => {
    setValue(name, currentValue === options[0] ? options[1] : options[0], { shouldValidate: true });
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* Etiqueta opcional */}
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}

      {/* Switcher principal */}
      <div
        role="button"
        tabIndex={0}
        className="relative flex items-center h-8 w-28 rounded-full cursor-pointer bg-gray-300 dark:bg-gray-700"
        onClick={handleToggle}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
      >
        {/* Indicador dinámico */}
        <div
          className={`absolute top-1 h-6 w-1/2 rounded-full bg-white dark:bg-gray-800 transition-transform duration-300 ${
            currentValue === options[1] ? 'translate-x-full' : 'translate-x-0'
          } flex items-center justify-center`}
        >
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {currentValue || options[0]}
          </span>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default Switcher1;
