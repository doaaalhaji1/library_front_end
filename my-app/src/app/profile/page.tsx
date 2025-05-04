'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import ProfileImageUploader from '../components/ProfileImageUploader';
import ProfileForm from '../components/ProfileForm';
import ErrorDisplay from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
require('dotenv').config();     

interface UserProfile {
  id: number;
  name: string;
  email: string;
  image: string;
  role: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setProfile(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (error) return <ErrorDisplay error={error} onRetry={fetchProfile} />;
  if (!profile) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Update profile  </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ProfileImageUploader 
          profile={profile} 
          onProfileUpdate={setProfile} 
          onError={setError}
        />
        
        <ProfileForm 
          profile={profile} 
          onProfileUpdate={setProfile} 
          onError={setError}
          setLoading={setLoading}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProfilePage;