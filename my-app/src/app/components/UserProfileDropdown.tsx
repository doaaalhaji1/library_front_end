"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
require('dotenv').config();   

interface UserProfile {
  name: string;
  image: string;
}

export default function UserProfileDropdown() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
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

        setProfile({
          name: data.data.name,
          image: data.data.image || "/default-avatar.png"
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <img
        src={profile?.image || "/default-avatar.png"}
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />

      {isDropdownOpen && (
        <div className="absolute right-0 top-12 mt-2 w-auto bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
          <div className="flex items-center p-4 bg-gray-50 border-b">
            <img
              src={profile?.image || "/default-avatar.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {profile?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">Your personal account</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-3 space-x-2">
            <Link
              href="/profile"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
              onClick={() => setIsDropdownOpen(false)}
            >
              profile
            </Link>

           <LogoutButton/>
          </div>
        </div>
      )}
    </div>
  );
}