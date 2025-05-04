import React from "react";
import { FiCalendar, FiUser, FiBook, FiCheckCircle } from "react-icons/fi";
import { format } from "date-fns";

export default function ReservationCard({ reservation }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <FiUser className="text-gray-500 mr-2" />
          <div>
            <h3 className="font-medium">{reservation.user?.name || "Unknown User"}</h3>
            <p className="text-sm text-gray-500">Reserved by</p>
          </div>
        </div>

        {/* Book Info */}
        <div className="mb-4">
          <div className="flex items-start">
            <FiBook className="text-gray-500 mr-2 mt-1" />
            <div>
              <h4 className="font-medium">Books ({reservation.books?.length || 0})</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {reservation.books?.map((book) => (
                  <li key={book.id}>{book.title}</li>
                )) || <li>No books listed</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1" />
              <span>Start Date</span>
            </div>
            <p>{format(new Date(reservation.reservation_start_date), "dd/MM/yyyy")}</p>
          </div>
          <div>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-1" />
              <span>End Date</span>
            </div>
            <p>{format(new Date(reservation.reservation_end_date), "dd/MM/yyyy")}</p>
          </div>
        </div>

        {/* Approval Info */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center text-green-600">
            <FiCheckCircle className="mr-1" />
            <span>Approved</span>
          </div>
        </div>
      </div>
    </div>
  );
}