'use client';

import { useRouter } from 'next/navigation';
require('dotenv').config();   

const DeleteAccountButton = () => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone!")) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
  
      alert('Account deleted successfully!');
       localStorage.removeItem('token');
      router.push('/login');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred while deleting the account');    }
  };

  return (
    <button
      onClick={handleDeleteAccount}
      className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
    >
Delete account
    </button>
  );
};

export default DeleteAccountButton;