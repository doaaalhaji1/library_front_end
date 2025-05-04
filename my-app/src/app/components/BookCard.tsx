// components/BookCard.tsx
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    description: string;
    language: string;
    image: string;
    status: 'available' | 'reserved';
    categories?: { name: string }[];
    authors?: { name: string }[];
  };
}

export default function BookCard({ book }: BookCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/books/${book.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-40"> 
        <Image
          src={book.image || '/book-placeholder.jpg'}
          alt={`book cover${book.title}`}
          fill
          className="object-contain" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold text-[#2D60B0] mb-2 line-clamp-1">
          {book.title}
        </h2>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {book.description}
        </p>
        
        <div className="space-y-1 text-sm text-gray-500 mb-4">
          <div className="flex gap-1">
            <span className="font-medium">the language:</span>
            <span>{book.language}</span>
          </div>
          
          <div className="flex gap-1">
            <span className="font-medium">Categories:</span>
            <span>
              {book.categories ? 
                book.categories.map(c => c.name).join(', ') : 
                'unknown'}
            </span>
          </div>
          
          <div className="flex gap-1">
            <span className="font-medium">authors:</span>
            <span>
              {book.authors ? 
                book.authors.map(a => a.name).join(', ') : 
                'unknown'}
            </span>
          </div>
          
          <div className="flex gap-1">
            <span className="font-medium">Status:</span>
            <span className={
              book.status === 'available' ? 
              'text-green-600' : 
              'text-red-600'
            }>
              {book.status === 'available' ? 'available' : 'not available'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleViewDetails}
          className="mt-auto w-full bg-[#2D60B0] text-white py-2 px-4 rounded-md hover:bg-[#1E4A8A] transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <span>View details and reservation</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}