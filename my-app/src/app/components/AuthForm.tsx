import React, { useState } from 'react';
import { InputField } from './InputField';
import { ActionButton } from './ActionButton';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

interface AuthFormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  isLoading: boolean;
  fields: {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }[];
  buttonLabel: string;
  linkText: string;
  linkHref: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  onSubmit,
  error,
  isLoading,
  fields,
  buttonLabel,
  linkText,
  linkHref,
}) => {
  return (
    <div className="relative z-10 bg-white p-8 rounded-lg shadow-md w-96">
      <h1 className="text-4xl font-semibold text-[#2D60B0] mb-4 flex items-center justify-center">
        <FiUser className="mr-2" /> {title}
      </h1>
      <form onSubmit={onSubmit}>
        {/* حقول الإدخال */}
        {fields.map((field, index) => (
          <InputField key={index} {...field} />
        ))}

        {/* عرض رسالة الخطأ */}
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {/* زر الإرسال */}
        <ActionButton
          label={buttonLabel}
          icon={<FiArrowLeft />}
          type="submit"
          isLoading={isLoading}
        />

        {/* رابط التوجيه */}
        <p className="text-center mt-4">
          {linkText}{' '}
          <a href={linkHref} className="text-blue-500 hover:underline">
            {linkText === 'Don\'t have an account?' ? 'Sign up' : 'Login'}
          </a>
        </p>
      </form>
    </div>
  );
};