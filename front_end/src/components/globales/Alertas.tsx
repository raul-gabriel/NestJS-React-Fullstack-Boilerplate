// Alertas.tsx
import React, { useState } from 'react';

interface AlertasProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

const Alertas: React.FC<AlertasProps> = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
  };

  const typeStyles = {
    success: {
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-800',
      iconColor: 'text-teal-500',
      iconSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      ),
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      iconSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      ),
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
      iconSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M15 9l-6 6"></path>
          <path d="M9 9l6 6"></path>
        </svg>
      ),
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
      iconSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 16h.01"></path>
          <path d="M12 8v4"></path>
        </svg>
      ),
    },
  };

  if (!visible) return null;

  const styles = typeStyles[type];

  return (
    <div
      role="alert"
      className={`${styles.bgColor} ${styles.borderColor} mt-2 mb-2 border rounded-lg p-4 text-sm ${styles.textColor} transition-transform transform ${!visible ? 'translate-x-5 opacity-0' : ''}`}
    >
      <div className="flex items-center">
        <div className={`shrink-0 ${styles.iconColor}`}>
          {styles.iconSvg}
        </div>
        <div className="ms-2 flex-grow">
          <h3 className="text-sm font-medium">{message}</h3>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="ms-auto text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alertas;
