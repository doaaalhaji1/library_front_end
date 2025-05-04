'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteAccountButton from '../components/DeleteAccountButton';
require('dotenv').config();   

interface ProfileFormProps {
  profile: {
    id: number;
    name: string;
    email: string;
  };
  onProfileUpdate: (updatedProfile: any) => void;
  onError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

const ProfileForm = ({ profile, onProfileUpdate, onError, setLoading, loading }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }

      onProfileUpdate(data.data);
      onError(null);
      alert('Profile updated successfully');
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An error occurred during the update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block mb-2 font-medium">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block mb-2 font-medium">New password (optional):</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          placeholder="Leave it blank if you don't want to change it."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? ' Saving....' : 'Save changes'}
      </button>

      <DeleteAccountButton />
    </form>
  );
};

export default ProfileForm;