"use client"
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

export default function BooksPage({ books }: { books: any[] }) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  const handleSearchResults = (results: any[], isLoading: boolean, error: string | null) => {
    setSearchResults(results);
    setSearchLoading(isLoading);
    setSearchError(error);
    setCurrentPage(1); // Reset to page 1 when new results are loaded
  };

  const displayedBooks = searchResults.length > 0 ? searchResults : books;
  const totalPages = Math.ceil(displayedBooks.length / booksPerPage);

  const currentBooks = displayedBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop(); // Scroll to the top when changing pages
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop(); // Scroll to the top when changing pages
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <Nav activeTab="books" />
      <div className="flex-grow p-4">
        <SearchBar onSearchComplete={handleSearchResults} />
        {searchLoading ? (
          <p className="text-center text-gray-600">Loading books...</p>
        ) : searchError ? (
          <p className="text-center text-red-500">{searchError}</p>
        ) : displayedBooks.length === 0 ? (
          <p className="text-center text-gray-600">No books available.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

