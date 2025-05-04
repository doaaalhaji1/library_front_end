"use client";
import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import ReservationList from "../../components/ReservationList";
require('dotenv').config();

export default function ApprovedReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovedReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reservations/approved`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch approved reservations");

        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedReservations();
  }, []);

  if (loading) return <div className="text-center py-8">Loading approved reservations...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center p-2 rounded-full hover:bg-gray-100 mr-4"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold">Approved Reservations</h1>
      </div>

      {/* Reservation List */}
      <ReservationList reservations={reservations} />
    </div>
  );
}