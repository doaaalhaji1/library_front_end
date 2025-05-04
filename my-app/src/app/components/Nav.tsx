import Link from 'next/link';
import UserProfileDropdown from './UserProfileDropdown';

type NavProps = {
  activeTab: 'books' | 'mybooks';
};

export default function Nav({ activeTab }: NavProps) {
  return (
    <nav className="w-full bg-[#2D60B0] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="flex items-center text-2xl md:text-3xl font-bold hover:text-blue-100 transition-colors gap-2">
              {/* إضافة الأيقونة هنا */}
              <img
                src="/favicon.png"
                alt="Library Icon"
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              DSM library
            </h1>
          </div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex gap-4">
              <Link href="/books" className={`px-3 py-2 rounded-md transition-colors ${activeTab === 'books' ? 'bg-white text-[#2D60B0] font-medium' : 'hover:bg-blue-700'}`}>
                Available books
              </Link>
              <Link href="/mybooks" className={`px-3 py-2 rounded-md transition-colors ${activeTab === 'mybooks' ? 'bg-white text-[#2D60B0] font-medium' : 'hover:bg-blue-700'}`}>
                My books
              </Link>
            </div>
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}