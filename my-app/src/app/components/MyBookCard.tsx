'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

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
  status: 'available' | 'reserved' | 'pending' | 'delivered';
  authors?: Author[];
  categories?: Category[];
}

interface Reservation {
  id: number;
  status: string;
  reservation_start_date: string;
  reservation_end_date: string;
  books: Book[];
}

interface MyBookCardProps {
  reservation: Reservation;
  onViewDetails: (bookId: number) => void;
  onReturnBook: (bookId: number) => Promise<void>;
  onCancelReservation?: (bookId: number) => Promise<void>;
}

export default function MyBookCard({ 
  reservation, 
  onViewDetails, 
  onReturnBook,
  onCancelReservation
}: MyBookCardProps) {
  const [loading, setLoading] = useState<{id: number, action: 'return' | 'cancel'} | null>(null);
  const router = useRouter();

  const getStatusDetails = (status: string) => {
    const statusMap = {
      available: { text: 'Received', color: 'bg-green-100 text-green-800' },
      reserved: { text: 'reserved', color: 'bg-blue-100 text-blue-800' },
      pending: { text: ' Pending', color: 'bg-yellow-100 text-yellow-800' },
      delivered: { text: 'Waiting for delivery confirmation', color: 'bg-purple-100 text-purple-800' }
    };

    return statusMap[status as keyof typeof statusMap] || { text: status, color: 'bg-gray-100 text-gray-800' };
  };

  const handleAction = async (bookId: number, action: 'return' | 'cancel') => {
    setLoading({id: bookId, action});
    try {
      if (action === 'return') {
        await onReturnBook(bookId);
      } else if (onCancelReservation) {
        await onCancelReservation(bookId);
      }
    } catch (error) {
      console.error(`Error in ${action}:`, error);
    } finally {
      setLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {reservation.books.map((book) => {
        const statusDetails = getStatusDetails(book.status);
        const isProcessing = loading?.id === book.id;
        const isReserved = book.status === 'reserved';
        
        return (
          <div key={book.id} className="p-4 border-b last:border-b-0">
            <div className="flex gap-4">
              <div className="flex-shrink-0 relative w-16 h-24">
                <Image
                  src={book.image || '/placeholder-book.jpg'}
                  alt={book.title}
                  fill
                  className="rounded object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-800">{book.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusDetails.color}`}>
                    {statusDetails.text}
                  </span>
                </div>
                
                {isReserved && (
                  <div className="text-xs text-gray-500 mt-1">
                    <p>from: {formatDate(reservation.reservation_start_date)}</p>
                    <p>to: {formatDate(reservation.reservation_end_date)}</p>
                  </div>
                )}
                
               
                
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {book.description || 'No description available'}
                </p>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onViewDetails(book.id)}
                    className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    the details
                  </button>
                  
                  {book.status === 'reserved' && (
                    <button
                      onClick={() => handleAction(book.id, 'return')}
                      disabled={isProcessing}
                      className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing && loading?.action === 'return' ? 'Returning...' : 'return'}
                    </button>
                  )}
                  
                 
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}