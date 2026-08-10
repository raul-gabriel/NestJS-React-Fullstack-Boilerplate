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
  onInputChange?: (texto: string) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  placeholder = "Selecciona una opción...",
  className = "",
  onSelect,
  onInputChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

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
      onSelect(option.value);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onInputChange) {
      onInputChange(value);
    }
  };

  return (
    <div className={`relative w-64 ${className}`} ref={dropdownRef}>
      {/* Botón principal */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between
                   border border-slate-300 rounded-md px-3 py-2.5
                   text-left bg-white text-sm
                   shadow-sm hover:border-slate-400
                   focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700
                   transition-colors"
      >
        <span className={`truncate ${selected ? "text-slate-800" : "text-slate-400"}`}>
          {selected?.label || placeholder}
        </span>

        <svg
          className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-10 mt-1.5 w-full
                     rounded-md shadow-lg
                     bg-white border border-slate-200
                     max-h-72 overflow-hidden"
        >
          {/* Input de búsqueda */}
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <svg
                className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Buscar..."
                autoFocus
                className="w-full border border-slate-300 rounded-md pl-8 pr-3 py-2 text-sm text-slate-800
                           bg-white placeholder:text-slate-400
                           focus:outline-none focus:ring-1 focus:ring-primary-700 focus:bordeprimary-700"
              />
            </div>
          </div>

          {/* Opciones */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selected?.value === option.value;
                return (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors
                      ${isSelected ? "bg-[#1B3A5C]/5 text-[#1B3A5C] font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    {option.label}
                    {isSelected && (
                      <svg className="w-4 h-4 text-[#1B3A5C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-4 text-sm text-slate-400 text-center">
                No se encontraron resultados
              </li>
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
    placeholder="Selecciona un framework..."
    onSelect={handleSelect}
/>
*/



/*
// ===================================== Ejemplo con API + búsqueda (debounce) ==================================
import { useEffect, useRef, useState } from "react";
import { fetchData } from "@/services/api";

interface TupaApi {
    id: number;
    nombre: string;
}

const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
const [cargando, setCargando] = useState(false);
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const buscar = async (texto: string = "") => {
    try {
        setCargando(true);
        const data = await fetchData<TupaApi[]>("tupa-procedimientos/tupa-data", texto);
        setOptions(data.map((t) => ({ value: String(t.id), label: t.nombre })));
    } catch (error) {
        console.error("Error al buscar:", error);
    } finally {
        setCargando(false);
    }
};

// carga inicial (primeros resultados sin filtro)
useEffect(() => {
    buscar();
}, []);

// se dispara mientras el usuario escribe en el input del ComboBox
const handleInputChange = (texto: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
        buscar(texto);
    }, 350);
};

const handleSelect = (value: string) => {
    console.log("Seleccionado:", value);
};

<ComboBox
    options={options}
    placeholder={cargando ? "Buscando..." : "Selecciona un framework..."}
    onSelect={handleSelect}
    onInputChange={handleInputChange}
/>
*/
