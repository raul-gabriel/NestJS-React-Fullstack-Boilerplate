import React from 'react';

interface IconProps {
  className?: string;
}

const DotsVerticalIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v.01M12 12v.01M12 18v.01"
    />
  </svg>
);

export default DotsVerticalIcon;
