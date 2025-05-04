"use client";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";
require('dotenv').config();

export default function ApproveReservationButton({ reservationId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this reservation?")) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reservation/${reservationId}/approve`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve reservation");
      }

      if (onSuccess) {
        onSuccess(reservationId);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleApprove}
        disabled={isLoading}
        className={`flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        title="Approve reservation"
      >
        <FiCheck className="mr-1" />
        {isLoading ? 'Processing...' : 'Approve'}
      </button>
      
      {error && (
        <div className="absolute z-10 mt-1 w-48 bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs">
          {error}
        </div>
      )}
    </div>
  );
}