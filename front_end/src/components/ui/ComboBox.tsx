import React, { useState, useEffect, useRef } from "react";

type Option = {
  value: string;
  label: string;
};

interface ComboBoxProps {
  /** Modo local: lista fija, filtra en el cliente */
  options?: Option[];
  /** Modo API: busca en el servidor (debounce interno). Si se pasa, tiene prioridad sobre options */
  fetchOptions?: (search: string) => Promise<Option[]>;
  /** Opcional: valor controlado desde el padre ("" para limpiar) */
  value?: string;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  onSelect?: (value: string, option: Option) => void;
  /** Se dispara al escribir (útil si prefieres manejar la búsqueda afuera, como antes) */
  onInputChange?: (texto: string) => void;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  options = [],
  fetchOptions,
  value,
  placeholder = "Selecciona una opción...",
  className = "",
  debounceMs = 350,
  onSelect,
  onInputChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);
  const [remoteOptions, setRemoteOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fetchRef = useRef(fetchOptions);
  fetchRef.current = fetchOptions; // evita bucles si el padre no usa useCallback

  const isRemote = !!fetchOptions;

  const currentOptions = isRemote
    ? remoteOptions
    : options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  // Click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modo API: carga al abrir y al escribir (debounce)
  useEffect(() => {
    if (!isRemote || !isOpen) return;
    let active = true;
    const timer = setTimeout(
      async () => {
        try {
          setLoading(true);
          const result = await fetchRef.current!(search);
          if (active) setRemoteOptions(result);
        } catch (err) {
          console.error("Error al buscar opciones:", err);
        } finally {
          if (active) setLoading(false);
        }
      },
      search ? debounceMs : 0
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, isOpen, isRemote, debounceMs]);

  // Sincronizar value controlado
  useEffect(() => {
    if (value === undefined) return;
    if (value === "") {
      setSelected(null);
      return;
    }
    const pool = isRemote ? remoteOptions : options;
    const found = pool.find((o) => o.value === value);
    if (found) setSelected(found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, remoteOptions, options]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setSearch("");
    setIsOpen(false);
    onSelect?.(option.value, option);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    setSearch(texto);
    onInputChange?.(texto);
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
                           focus:outline-none focus:ring-1 focus:ring-primary-700 focus:border-primary-700"
              />
            </div>
          </div>

          {/* Opciones */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {loading ? (
              <li className="px-3 py-4 text-sm text-slate-400 text-center">Buscando...</li>
            ) : currentOptions.length > 0 ? (
              currentOptions.map((option) => {
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
// ============ Modo local ============
<ComboBox
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js" },
  ]}
  onSelect={(value) => console.log(value)}
/>

// ============ Modo API (debounce interno) ============
const fetchTupa = async (texto: string) => {
  const data = await fetchData<TupaApi[]>("tupa-procedimientos/tupa-data", texto);
  return data.map((t) => ({ value: String(t.id), label: t.nombre }));
};

<ComboBox
  fetchOptions={fetchTupa}
  value={tupaId}
  onSelect={(value) => setTupaId(value)}
/>
*/
