import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // Aquí se insertará el contenido dinámico
  size?: "small" | "medium" | "large"; // Tamaño del modal
  title?: string; // Título opcional del modal
  idModal?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  title = "",
  idModal = 'modal'
}) => {
  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-2xl",
    large: "max-w-4xl",
  };

  return (
    <div
      id={idModal}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${isOpen ? "flex" : "hidden"
        }`}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white p-8 rounded-xl shadow-xl max-h-screen overflow-y-auto`}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition focus:outline-none"
          aria-label="Cerrar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Título */}
        {title && (
          <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
            {title}
          </h4>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
