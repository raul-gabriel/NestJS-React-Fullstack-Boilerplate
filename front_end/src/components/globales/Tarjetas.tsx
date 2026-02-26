import type { ReactNode } from "react";

interface TarjetasStatsProps {
  children: ReactNode;
  className?: string;
}

const Tarjetas: React.FC<TarjetasStatsProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`
        rounded-xl
        border border-gray-200
        bg-white
        p-6
        shadow-sm
        transition-all
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Tarjetas;