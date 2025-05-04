"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiTrash2 } from "react-icons/fi";
require('dotenv').config();

export default function DeleteCategoryButton({ categoryId, categoryName, onDeleteSuccess }:any) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to delete category");
      }

      // Call success handler if provided
      if (onDeleteSuccess) {
        onDeleteSuccess(responseData.data);
      }
      
      // Optionally refresh the page
      router.refresh();

    } catch (err:any) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`text-red-600 hover:text-red-900 p-1 ${isDeleting ? 'opacity-50' : ''}`}
        aria-label={`Delete ${categoryName}`}
        title="Delete category"
      >
        <FiTrash2 className="text-lg" />
      </button>
      
      {error && (
        <div className="absolute top-full left-0 mt-1 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs z-10">
          {error}
        </div>
      )}
    </div>
  );
}