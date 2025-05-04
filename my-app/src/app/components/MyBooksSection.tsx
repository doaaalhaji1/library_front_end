'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MyBookCard from './MyBookCard';
import LoadingSpinner from './LoadingSpinner';
require('dotenv').config();     

interface Author {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  description: string;
  image: string;
  status: string;
  authors?: Author[];
  categories?: Category[];
}

interface Reservation {
  id: number;
  user_id: number;
  employee_id: number;
  recipient_user_id: number | null;
  reservation_start_date: string;
  reservation_end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  books: Book[];
}

export default function MyBooksSection() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/mybooks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch your books');
        }

        const data = await response.json();
        setReservations(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [router]);

  const handleReturnBook = async (bookId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/books/${bookId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to return book');
      }

      setReservations(prev => prev.map(reservation => ({
        ...reservation,
        books: reservation.books.map(book =>
          book.id === bookId ? { ...book, status: 'delivered' } : book
        )
      })));

      alert('Book returned successfully!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Book Reservations</h2>
      {reservations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You don't have any book reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <MyBookCard 
              key={reservation.id} 
              reservation={reservation} 
              onViewDetails={(bookId) => router.push(`/books/${bookId}`)}
              onReturnBook={handleReturnBook}
            />
          ))}
        </div>
      )}
    </div>
  );
}
