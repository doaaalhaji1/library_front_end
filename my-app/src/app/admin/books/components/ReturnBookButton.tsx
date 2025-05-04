"use client";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";
require('dotenv').config();

export default function ReturnBookButton({ bookId, onSuccess }:any) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReturn = async () => {
    if (!confirm("Are you sure you want to mark this book as returned?")) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to return book");
      }

      if (onSuccess) {
        onSuccess(bookId);
      }
    } catch (err:any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleReturn}
      disabled={isLoading}
      className={`flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      title="Mark as returned"
    >
      <FiCheck className="mr-1" />
      {isLoading ? 'Processing...' : 'Mark Returned'}
    </button>
  );
}