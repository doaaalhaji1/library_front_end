'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
require('dotenv').config();   
interface BookReservationFormProps {
  bookId: number;
  bookStatus: 'available' | 'reserved';
}

export default function BookReservationForm({ bookId, bookStatus }: BookReservationFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bookStatus !== 'available') {
      setError('The book is currently unavailable for reservation.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select start and end dates.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: bookId,
          start_date: startDate,
          end_date: endDate,
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error('Failed to parse server response.');
      }

      if (response.ok) {
        setSuccess('The book has been successfully reserved!');
        setTimeout(() => {
          router.push('/books');
        }, 2000);
      } else {
        setError(`خطأ ${response.status}: ${result.message || result.error || 'Failed to reserve the book.'}`);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Reserve the book</h3>

      {bookStatus !== 'available' ? (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded">This book is currently unavailable for reservation.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-medium">Start date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 border rounded-lg" required />
            </div>
            <div>
              <label className="block mb-2 font-medium">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 border rounded-lg" required />
            </div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

          <button type="submit" disabled={isSubmitting} className={`w-full py-3 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
          {isSubmitting ? 'Processing...' : 'Book Reservation'}          </button>
        </form>
      )}
    </div>
  );
}
