import { useState } from 'react';

const SwitcherThree = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div>
      <label
        htmlFor="toggle3"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle3"
            className="sr-only"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />

          {/* Fondo */}
          <div
            className={`block h-8 w-14 rounded-full transition-colors duration-300 ${enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
          ></div>

          {/* Botón */}
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center 
          rounded-full bg-white shadow-sm 
          transition-all duration-300
          ${enabled ? "translate-x-6" : "translate-x-0"}
        `}
          >
            {/* Icono check */}
            {enabled ? (
              <svg
                className="fill-blue-600"
                width="11"
                height="8"
                viewBox="0 0 11 8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.09 0.95c-.18-.19-.47-.19-.65 0L4.16 6.23 1.58 3.63c-.18-.19-.47-.19-.65 0-.18.18-.18.47 0 .65l2.65 2.66c.16.16.37.24.57.24.21 0 .4-.08.55-.24l5.33-5.35c.18-.18.18-.47 0-.65z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherThree;
