import ClientBooksPage from './ClientBooksPage';
import { cookies } from 'next/headers';
require('dotenv').config();

async function getBooks() {
  const token = (await cookies()).get('token')?.value;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/availableBooks`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error('Failed to fetch books');
  const data = await res.json();
  return data;
}

export default async function BooksPage() {
  const books = await getBooks();
  return <ClientBooksPage books={books} />;
}
