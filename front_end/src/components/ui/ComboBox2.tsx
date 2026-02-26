import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";


interface ComboBox2Props {
  className?: string;
  name: string;
  register: UseFormRegisterReturn; // Integración con react-hook-form
  error?: FieldError;
  label?: string;
  placeholder?: string;
  fetchOptions: (search: string) => Promise<{ value: string; label: string }[]>; // Función para obtener opciones
}


const ComboBox2 = forwardRef(
  (
    { className, name, register, error, label, placeholder, fetchOptions }: ComboBox2Props,
    ref
  ) => {
    const [options, setOptions] = useState<{ value: string; label: string }[]>([]); // Opciones actuales
    const [search, setSearch] = useState(""); // Texto del input de búsqueda
    const [selectedLabel, setSelectedLabel] = useState<string>(""); // Texto visible del input
    const [selectedValue, setSelectedValue] = useState<string>(""); // Valor registrado en el formulario
    const [isOpen, setIsOpen] = useState(false); // Estado del dropdown
    const [loading, setLoading] = useState(false); // Estado de carga

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Exponer método setSelectedOption
    useImperativeHandle(ref, () => ({
      setSelectedOption(value: string, label: string) {
        setSelectedValue(value);
        setSelectedLabel(label);
        register.onChange({ target: { name, value } });
      },
    }));

    // Consultar opciones iniciales al montar el componente
    useEffect(() => {
      const fetchInitialOptions = async () => {
        try {
          setLoading(true);
          const initialOptions = await fetchOptions("");
          setOptions(initialOptions);
        } catch (error) {
          console.error("Error al obtener las opciones iniciales:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchInitialOptions();
    }, [fetchOptions]);

    // Buscar opciones cuando se escribe en el campo
    useEffect(() => {
      const fetchSearchOptions = async () => {
        if (!search) return; // Si no hay búsqueda, no consultar
        setLoading(true);
        try {
          const newOptions = await fetchOptions(search);


          setOptions(newOptions);
        } catch (error) {
          console.error("Error al buscar opciones:", error);
        } finally {
          setLoading(false);
        }
      };

      const delayDebounce = setTimeout(fetchSearchOptions, 300); // Debounce para evitar múltiples llamadas
      return () => clearTimeout(delayDebounce);
    }, [search, fetchOptions]);

    // Manejar clic fuera del dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Seleccionar una opción
    const handleSelect = (value: string, label: string) => {
      setSelectedValue(value); // Valor enviado al formulario
      setSelectedLabel(label); // Texto visible en el campo
      register.onChange({ target: { name, value } }); // Asignar el valor al formulario
      setSearch("");
      setIsOpen(false);
    };

    return (
      <div className="mb-4 relative" ref={dropdownRef}>
        {label && (
          <label className="block text-[14px] font-medium text-gray-900 dark:text-gray-100">
            {label}
          </label>
        )}
        <div
          className={`inputField_full mb-0 mt-0 ${error ? "border-colorError" : "border-gray-300"
            } ${className}`}
          //onClick={() => setIsOpen(true)} 
          onClick={() => setIsOpen((prev) => !prev)}>
          {/* Input Visible */}
          <input
            {...register}
            value={selectedValue} // Valor enviado al formulario
            hidden // Ocultar el input nativo de react-hook-form
          />
          <input
            value={selectedLabel} // Texto visible en el input
            readOnly
            placeholder={placeholder || `Seleccione una opcion`}
            className="w-full outline-none bg-transparent cursor-pointer text-gray-900 dark:text-gray-100"
          />
          <span className="absolute right-3 mt-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m6 9.657l1.414 1.414l4.243-4.243l4.243 4.243l1.414-1.414L11.657 4zm0 4.786l1.414-1.414l4.243 4.243l4.243-4.243l1.414 1.414l-5.657 5.657z"
              ></path>
            </svg>
          </span>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ul>
              {loading ? (
                <li className="p-2 text-gray-500 dark:text-gray-400">
                  Cargando...
                </li>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option.value, option.label)}
                    className="p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-900 dark:text-gray-100"
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500 dark:text-gray-400">
                  No se encontraron opciones
                </li>
              )}
            </ul>
          </div>
        )}

        {error && (
          <p className="text-colorError text-[12px] mt-1">{error.message}</p>
        )}
      </div>
    );
  }
);

export default ComboBox2;
