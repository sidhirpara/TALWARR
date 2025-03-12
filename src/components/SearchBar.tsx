import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { products, Product } from '../data/products';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const query = searchQuery.toLowerCase();
      const results = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleProductClick = (product: Product) => {
    let path = '/';
    switch (product.category) {
      case 'New Arrivals':
        path = '/#new-arrivals';
        break;
      case 'Gallery':
        path = '/gallery';
        break;
      case 'Bestsellers':
        path = '/#bestsellers';
        break;
    }
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div 
        ref={searchContainerRef} 
        className="fixed inset-x-0 top-0 bg-white shadow-lg p-4 animate-slide-down"
      >
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for perfumes..."
                aria-label="Search for perfumes"
                className="w-full pl-12 pr-10 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-serif text-lg text-slate-800">{product.name}</h3>
                          <p className="text-sm text-slate-600">{product.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-medium text-slate-800">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="ml-2 px-2 py-1 text-xs bg-slate-200 text-slate-600 rounded-full">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No products found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Popular Searches */}
            {!searchQuery && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Floral', 'Citrus', 'Woody', 'Oriental'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-700 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;