'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
require('dotenv').config();   

interface ProfileImageUploaderProps {
  profile: {
    id: number;
    image: string;
  };
  onProfileUpdate: (updatedProfile: any) => void;
  onError: (error: string) => void;
}

const ProfileImageUploader = ({ profile, onProfileUpdate, onError }: ProfileImageUploaderProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(profile.image);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setImage(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!image) {
      alert('Please choose an image first.');
      return;
    }

    setUploadingImage(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upateimgprofile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }

      onProfileUpdate({
        ...profile,
        image: result.imageUrl || imagePreview || '',
      });

      alert('Image updated successfully');
        } catch (err) {
      onError(err instanceof Error ? err.message : 'An error occurred while uploading the image.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative mb-4">
        <img
          src={imagePreview || '/default-profile.png'}
          alt="Profile Picture"
                   
          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
        />
      </div>
      
      <div className="w-full max-w-xs">
        <label className="block mb-2 font-medium">Change image:</label>
        <div className="flex gap-2">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-3 py-2 border rounded"
            id="profileImage"
          />
          <button
            type="button"
            onClick={handleImageUpload}
            disabled={!image || uploadingImage}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
          >
            {uploadingImage ? 'Uploading...' : 'Save image'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUploader;