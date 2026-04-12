import React, { useState, useEffect, useRef } from "react";

type Option = {
  value: string;
  label: string;
};

interface ComboBoxProps {
  options: Option[];
  placeholder?: string;
  className?: string;
  onSelect?: (value: string) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  placeholder = "Seleccione una opción",
  className = "",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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
    onSelect?.(option.value);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Input visible */}
      <div
        className="relative inputField mb-0 mt-0 cursor-pointer"
        onClick={() => setIsOpen((p) => !p)}
      >
        <input
          value={selected?.label ?? ""}
          readOnly
          placeholder={placeholder}
          className="w-full outline-none bg-transparent cursor-pointer text-gray-900"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path fill="currentColor" d="m6 9.657l1.414 1.414l4.243-4.243l4.243 4.243l1.414-1.414L11.657 4zm0 4.786l1.414-1.414l4.243 4.243l4.243-4.243l1.414 1.414l-5.657 5.657z" />
          </svg>
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full border border-gray-300 rounded-md p-2 text-gray-900 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <li
                  key={o.value}
                  onClick={() => handleSelect(o)}
                  className="p-2 cursor-pointer hover:bg-blue-100 text-gray-900 transition-colors"
                >
                  {o.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No se encontraron opciones</li>
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