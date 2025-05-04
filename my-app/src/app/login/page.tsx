'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '../components/AuthForm';
require('dotenv').config();     

export default function Login() {
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      document.cookie = `token=${data.access_token}; Path=/; Secure; SameSite=Lax`;

      if (data.role === 'admin' || data.role === 'employee') {
        router.push('/admin');
      } else {
        router.push('/books');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
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
        title="Login"
        onSubmit={handleLogin}
        error={error}
        isLoading={isLoading}
        fields={[
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
        buttonLabel="Login"
        linkText="Don't have an account?"
        linkHref="/register"
      />
    </div>
  );
}