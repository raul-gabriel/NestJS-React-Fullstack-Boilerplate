import React, { useState } from "react";

interface Switcher2Props {
  options: [string, string]; // Ejemplo: ['DNI', 'RUC']
  name?: string; // Nombre opcional para formularios
  onChange?: (value: string) => void; // Callback para devolver la opción seleccionada
}

const Switcher2: React.FC<Switcher2Props> = ({ options, name, onChange }) => {
  const [selected, setSelected] = useState<string>(options[0]);

  const toggleOption = () => {
    const newValue = selected === options[0] ? options[1] : options[0];
    setSelected(newValue);
    if (onChange) onChange(newValue);
  };

  return (
    <div className="flex items-center">
      <label
        htmlFor={name || "switcher2"}
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative flex rounded-full bg-gray-300 dark:bg-gray-700 p-1 transition-all duration-300">
          {options.map((option) => (
            <div
              key={option}
              className={`relative flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${selected === option
                  ? "bg-primario-claro-100 text-white"
                  : "text-gray-700 dark:text-gray-300"
                }`}
              onClick={toggleOption}
            >
              {option}
            </div>
          ))}
        </div>
      </label>
    </div>
  );
};

export default Switcher2;

/*
const handleSwitchChange = (value: string) => {
    console.log('Opción seleccionada:', value);
  };
*/