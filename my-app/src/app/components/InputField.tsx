import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={label} className="block text-lg font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        id={label}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};