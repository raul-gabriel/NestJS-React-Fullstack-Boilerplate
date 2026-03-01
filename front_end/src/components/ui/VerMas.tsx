import { useState } from "react";

interface VerMasProps {
  children: React.ReactNode;
  className?: string;
  notificacion?: string;
}

const VerMas = ({ children, className = "", notificacion }: VerMasProps) => {
  const [verMas, setVerMas] = useState(false);

  return (
    <div className="relative">
      {!verMas && (
        <>
          <button
            onClick={() => setVerMas(true)}
            className={`mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors ${className}`}
          >
            Ver más
          </button>

          {notificacion && (
            <span className="ml-2 inline-flex items-center rounded-md 
                           bg-yellow-50 px-2 py-1 text-xs font-medium 
                           text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
              {notificacion}
            </span>
          )}
        </>
      )}

      {verMas && (
        <div className="mt-2">
          {children}

          <button
            onClick={() => setVerMas(false)}
            className="mt-3 w-full text-center text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            Ver menos
          </button>
        </div>
      )}
    </div>
  );
};

export default VerMas;
