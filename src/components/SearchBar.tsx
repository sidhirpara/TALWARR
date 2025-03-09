import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to search for products
    console.log('Searching for:', searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="fixed inset-x-0 top-0 bg-white shadow-lg p-4 animate-slide-down">
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for perfumes..."
              aria-label="Search for perfumes"
              className="w-full pl-12 pr-10 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              autoFocus
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Floral', 'Citrus', 'Woody', 'Oriental'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;