import React, { useState, useEffect, useRef } from "react";

type Option = {
  value: string;
  label: string;
};

interface ComboBoxProps {
  options: Option[];
  placeholder?: string;
  buttonStyle?: string; // Estilo personalizado para el botón
  onSelect?: (value: string) => void; // Callback para enviar el valor seleccionado
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  placeholder = "Select an option...",
  buttonStyle = "",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/cerrar el dropdown
  const [search, setSearch] = useState(""); // Texto de búsqueda
  const [selected, setSelected] = useState<Option | null>(null); // Opción seleccionada

  const dropdownRef = useRef<HTMLDivElement>(null); // Referencia para clics fuera del componente

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setSearch("");
    setIsOpen(false);
    if (onSelect) {
      onSelect(option.value); // Envía el valor seleccionado al callback
    }
  };

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between border rounded-md p-2
        text-left bg-white text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500
        ${buttonStyle}`} // Estilos personalizados
      >
        {selected?.label || placeholder}
        <span className="ml-2 text-gray-500">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-10 mt-2 w-full rounded-md shadow-lg
          bg-white border border-gray-300 max-h-60 overflow-hidden`}
        >
          {/* Input de búsqueda */}
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Opciones */}
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="p-2 cursor-pointer hover:bg-blue-100 text-gray-900"
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComboBox;



/*
const options = [
        { value: "nextjs", label: "Next.js" },
        { value: "react", label: "React" },
        { value: "vue", label: "Vue.js" },
        { value: "angular", label: "Angular" },
        { value: "svelte", label: "Svelte" },
    ];

    const handleSelect = (value: string) => {
        console.log("Seleccionado:", value);
    };

            <ComboBox
            options={options}
            placeholder="Select framework..."
            buttonStyle="border-gray-300 hover:border-blue-500 focus:ring-blue-500"
            onSelect={handleSelect}
        />
        
        */