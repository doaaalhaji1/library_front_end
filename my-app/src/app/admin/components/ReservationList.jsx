import React from "react";
import ReservationCard from "./ReservationCard";

export default function ReservationList({ reservations }) {
  if (reservations.length === 0) {
    return (
      <div className="col-span-full text-center py-8 text-gray-500">
        No approved reservations found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((reservation) => (
        <ReservationCard key={reservation.id} reservation={reservation} />
      ))}
    </div>
  );
}