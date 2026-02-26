import React, { useState, useEffect, useRef, type ReactNode } from 'react';

interface TooltipProps {
  tooltipContent: ReactNode; // Contenido que se mostrará en el tooltip
  children: ReactNode;       // Elemento sobre el que se posiciona el tooltip
}

export const Tooltip: React.FC<TooltipProps> = ({ tooltipContent, children }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Maneja el click fuera del componente para ocultar el tooltip
  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsClicked(false);
      setVisible(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  // Muestra el tooltip en hover solo si no se activó por click
  const handleMouseEnter = () => {
    if (!isClicked) {
      setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isClicked) {
      setVisible(false);
    }
  };

  // Alterna la visibilidad con click
  const handleClick = () => {
    if (isClicked) {
      setIsClicked(false);
      setVisible(false);
    } else {
      setIsClicked(true);
      setVisible(true);
    }
  };

  // Cierra el tooltip mediante el botón "x"
  const handleCloseClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsClicked(false);
    setVisible(false);
  };

  // Ajusta la posición del tooltip según el espacio disponible en pantalla
  useEffect(() => {
    if (visible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const tooltipMaxWidth = 400; // ancho máximo deseado para el tooltip

      let style: React.CSSProperties = {};
      if (rect.left + tooltipMaxWidth / 2 > viewportWidth) {
        // Si se sale por la derecha, alineamos a la derecha
        style = { right: 0, left: 'auto', transform: 'none' };
      } else if (rect.left - tooltipMaxWidth / 2 < 0) {
        // Si se sale por la izquierda, alineamos a la izquierda
        style = { left: 0, transform: 'none' };
      } else {
        // Caso normal: centrado respecto al contenedor
        style = { left: '50%', transform: 'translateX(-50%)' };
      }
      setTooltipStyle(style);
    }
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {visible && (
        <div
          className="absolute z-50 bottom-full mb-2 px-3 py-2 bg-gray-700 text-white text-sm rounded-md shadow-lg whitespace-pre-wrap"
          style={{ maxWidth: '400px', ...tooltipStyle }}
        >
          <button
            onClick={handleCloseClick}
            className="absolute top-1 right-1 text-xs text-gray-400 hover:text-white"
          >
            ×
          </button>
          <pre>{tooltipContent}</pre>
        </div>
      )}
    </div>
  );
};

interface InfoIconProps {
  tooltipContent: ReactNode; // Contenido personalizado para el tooltip
  className?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({ tooltipContent, className }) => {
  return (
    <Tooltip tooltipContent={tooltipContent}>
      <div className={className}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          className="cursor-pointer"
        >
          <path
            fill="#14B8A6"
            d="M16 1.466C7.973 1.466 1.466 7.973 1.466 16S7.973 30.534 16 30.534S30.534 24.027 30.534 16S24.027 1.466 16 1.466m1.328 22.905H14.62v-2.595h2.708v2.596zm0-5.367v.858H14.62v-1.056c0-3.19 3.63-3.696 3.63-5.963c0-1.033-.923-1.825-2.133-1.825c-1.254 0-2.354.924-2.354.924l-1.54-1.916S13.74 8.44 16.358 8.44c2.486 0 4.795 1.54 4.795 4.136c0 3.632-3.827 4.05-3.827 6.427z"
          />
        </svg>
      </div>
    </Tooltip>
  );
};

export default InfoIcon;
