import React, { JSX } from 'react';

interface ActionButtonProps {
  label: string;
  icon?: JSX.Element;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  isLoading?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon,
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      type={type}
      className={`w-full py-2 bg-[#2D60B0] text-white rounded-lg hover:bg-[#4D9BF1] transition duration-300 flex items-center justify-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {isLoading ? 'Loading...' : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </>
      )}
    </button>
  );
};