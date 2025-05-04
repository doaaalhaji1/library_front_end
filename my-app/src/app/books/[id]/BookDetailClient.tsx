'use client';

import { useState } from 'react';
import BookReservationForm from '../../components/BookReservationForm';
import LoadingSpinner from '../../components/LoadingSpinner';

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
  language: string;
  image: string;
  status: 'available' | 'reserved';
  authors?: Author[];
  categories?: Category[];
  published_year?: number;
  pages?: number;
}

interface BookDetailClientProps {
  book: Book;
}

export default function BookDetailClient({ book }: BookDetailClientProps) {
  const [currentBook, setCurrentBook] = useState(book);

  const handleStatusChange = (newStatus: 'available' | 'reserved') => {
    setCurrentBook(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex justify-center bg-gray-100">
            <img
              src={currentBook.image || '/images/default-book.jpg'}
              alt={currentBook.title}
              className="max-h-96 object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/default-book.jpg';
              }}
            />
          </div>

          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {currentBook.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {(currentBook.categories || []).map((category) => (
                <span 
                  key={category.id}
                  className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                >
                  {category.name}
                </span>
              ))}
              {(!currentBook.categories || currentBook.categories.length === 0) && (
                <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                 Not categorized
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{currentBook.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Authors</h3>
                <p className="text-gray-900">
                  {(currentBook.authors || []).map(a => a.name).join('، ') || 'unknown'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">the language</h3>
                <p className="text-gray-900">{currentBook.language}</p>
              </div>
              {currentBook.published_year && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500"> Year of publication</h3>
                  <p className="text-gray-900">{currentBook.published_year}</p>
                </div>
              )}
              {currentBook.pages && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Number of pages</h3>
                  <p className="text-gray-900">{currentBook.pages}</p>
                </div>
              )}
            </div>

            <div className={`inline-block px-4 py-2 rounded-lg ${
              currentBook.status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {currentBook.status === 'available' ? 'available' : 'reserved'}
            </div>
          </div>
        </div>
      </div>

      <BookReservationForm 
        bookId={currentBook.id} 
        bookStatus={currentBook.status}
      />
    </div>
  );
}