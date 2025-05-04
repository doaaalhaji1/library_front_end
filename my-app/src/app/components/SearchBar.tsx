'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FiSearch, FiLoader } from "react-icons/fi";
require('dotenv').config();   

interface SearchBarProps {
  onSearchComplete: (results: any[], isLoading: boolean, error: string | null) => void;
}

export default function SearchBar({ onSearchComplete }: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        setCategories(await response.json());
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      // إضافة المعايير إذا كانت موجودة
      if (query) params.append('query', query);
      if (category) params.append('category', category);

      // تحديث الرابط باستخدام المعايير
      router.push(`?${params.toString()}`, { scroll: false });

      // إرسال طلب البحث إلى الـ API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/search?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();
      console.log('API Response:', data); // <-- تحقق من البيانات هنا

      onSearchComplete(data.data?.books || [], false, null);
    } catch (error) {
      onSearchComplete([], false, 'Failed to search');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 my-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Search Field */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for a book, author, or topic..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-48 px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin h-5 w-5" />
              Searching...
            </>
          ) : (
            <>
              <FiSearch className="h-5 w-5" />
              search
            </>
          )}
        </button>
      </div>
    </div>
  );
}
