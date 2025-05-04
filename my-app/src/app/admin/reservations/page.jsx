"use client";
import { useState, useEffect } from "react";
import { FiCheck, FiX, FiArrowLeft } from "react-icons/fi";
import ApproveReservationButton from "./components/ApproveReservationButton";
import RejectReservationButton from "./components/RejectReservationButton";

export default function PendingReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingReservations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://libraryproject.test/api/reservations?status=pending", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) throw new Error("Failed to fetch pending reservations");
        
        const data = await response.json();
        setReservations(data.filter(res => res.status === 'pending'));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReservations();
  }, []);

  const handleApproveSuccess = (reservationId) => {
    setReservations(reservations.filter(res => res.id !== reservationId));
  };

  const handleRejectSuccess = (reservationId) => {
    setReservations(reservations.filter(res => res.id !== reservationId));
  };

  if (loading) return <div className="text-center py-8">Loading pending reservations...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center p-2 rounded-full hover:bg-gray-100 mr-4"
        >
          <FiArrowLeft className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold">Pending Reservations</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Titles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No pending reservations found
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.user?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {reservation.books?.map(book => book.title).join(', ') || 'No books'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(reservation.reservation_start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {new Date(reservation.reservation_end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
            <div className="flex justify-center space-x-4">
              <ApproveReservationButton 
                reservationId={reservation.id}
                onSuccess={handleApproveSuccess}
              />
              <RejectReservationButton 
                reservationId={reservation.id}
                onSuccess={handleRejectSuccess}
              />
            </div>
          </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}