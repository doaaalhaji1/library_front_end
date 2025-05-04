"use client";
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
require('dotenv').config();

export default function DeleteUserButton({ userId, userName }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/deleteUser/${userId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }

      // Refresh the page or redirect after successful deletion
      router.refresh(); // Use this if the button is in a list
      // OR router.push('/admin/users'); // Use this if you want to redirect
      
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Delete error:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 transition-colors p-1"
      aria-label={`Delete ${userName}`}
      title="Delete user"
    >
      <FiTrash2 className="text-lg" />
    </button>
  );
}