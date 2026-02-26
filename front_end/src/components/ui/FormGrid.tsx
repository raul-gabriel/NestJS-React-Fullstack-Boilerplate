import React from "react";

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface FormGridProps {
  columns?: GridColumns; // Número de columnas para pantallas grandes (predeterminado)
  smColumns?: GridColumns; // Columnas para pantallas pequeñas 
  mdColumns?: GridColumns; // Columnas para pantallas medianas
  lgColumns?: GridColumns; // Columnas para pantallas grandes
  xlColumns?: GridColumns; // Columnas para pantallas extra grandes
  gap?: number; // Tamaño del espacio entre elementos
  children: React.ReactNode; // Los elementos del grid
  className?: string; // Clases adicionales para personalización
}

const FormGrid: React.FC<FormGridProps> = ({
  columns = 1,
  smColumns,
  mdColumns,
  lgColumns,
  xlColumns,
  gap = 4,
  children,
  className = "",
}) => {
  // Función para mapear columnas a clases de Tailwind
  const getColumnClass = (size: GridColumns | undefined, prefix: string): string => {
    const columnClasses: Record<GridColumns, string> = {
      1: `${prefix}:grid-cols-1`,
      2: `${prefix}:grid-cols-2`,
      3: `${prefix}:grid-cols-3`,
      4: `${prefix}:grid-cols-4`,
      5: `${prefix}:grid-cols-5`,
      6: `${prefix}:grid-cols-6`,
      7: `${prefix}:grid-cols-7`,
      8: `${prefix}:grid-cols-8`,
      9: `${prefix}:grid-cols-9`,
      10: `${prefix}:grid-cols-10`,
      11: `${prefix}:grid-cols-11`,
      12: `${prefix}:grid-cols-12`,
    };

    return size ? columnClasses[size] : "";
  };

  return (
    <div
      className={`grid grid-cols-${columns} 
      ${getColumnClass(smColumns, "sm")}
      ${getColumnClass(mdColumns, "md")}
      ${getColumnClass(lgColumns, "lg")}
      ${getColumnClass(xlColumns, "xl")}
      gap-${gap} ${className}`}
    >
      {children}
    </div>
  );
};

export default FormGrid;
