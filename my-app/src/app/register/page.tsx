'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '../components/AuthForm';
require('dotenv').config();     

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      document.cookie = `token=${token}; Path=/; Secure; SameSite=Lax`;
      router.push('/books');
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      document.cookie = `token=${data.access_token}; Path=/; Secure; SameSite=Lax`;

      router.push('/books');
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred while connecting to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen relative">
      <div className="absolute inset-0 z-0">
        <img
          src="/background11.jpg"
          alt="Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <AuthForm
        title="Sign Up"
        onSubmit={handleRegister}
        error={error}
        isLoading={isLoading}
        fields={[
          {
            label: 'Full Name',
            type: 'text',
            placeholder: 'Full name',
            value: name,
            onChange: (e) => setName(e.target.value),
          },
          {
            label: 'Email',
            type: 'email',
            placeholder: 'Email address',
            value: email,
            onChange: (e) => setEmail(e.target.value),
          },
          {
            label: 'Password',
            type: 'password',
            placeholder: 'Strong password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
          },
        ]}
        buttonLabel="Sign Up"
        linkText="Already have an account?"
        linkHref="/login"
      />
    </div>
  );
}