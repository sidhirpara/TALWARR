import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Mic, MicOff } from 'lucide-react';
import { products, Product } from '../data/products';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the necessary types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    mozSpeechRecognition: new () => SpeechRecognition;
    msSpeechRecognition: new () => SpeechRecognition;
  }
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const stopTimeoutRef = useRef<number>();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeSpeechRecognition = () => {
      try {
        setIsInitializing(true);
        const SpeechRecognitionAPI = 
          window.SpeechRecognition ||
          window.webkitSpeechRecognition ||
          window.mozSpeechRecognition ||
          window.msSpeechRecognition;

        if (!SpeechRecognitionAPI) {
          throw new Error('Speech recognition is not supported in this browser');
        }

        recognitionRef.current = new SpeechRecognitionAPI();
        
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          try {
            const transcript = event.results[event.results.length - 1];
            if (transcript.isFinal) {
              setSearchQuery(transcript[0].transcript);
              
              if (stopTimeoutRef.current) {
                window.clearTimeout(stopTimeoutRef.current);
              }
              stopTimeoutRef.current = window.setTimeout(() => {
                stopListening();
              }, 1000);
            }
          } catch (err) {
            console.error('Error processing speech result:', err);
            setError('Failed to process speech input. Please try again.');
            stopListening();
          }
        };

        recognitionRef.current.onend = () => {
          if (isListening && !stopTimeoutRef.current) {
            try {
              startListening();
            } catch (err) {
              console.error('Error restarting recognition:', err);
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = 'An error occurred with speech recognition.';
          
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please check your browser settings and permissions.';
              break;
            case 'no-speech':
              errorMessage = 'No speech was detected. Please try again.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your internet connection.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone was found. Please check your device settings.';
              break;
            case 'service-not-allowed':
              errorMessage = 'Speech recognition service is not allowed. Please try again later.';
              break;
          }
          
          setError(errorMessage);
          stopListening();
        };

        recognitionRef.current.onnomatch = () => {
          setError('Could not understand speech. Please try again.');
          stopListening();
        };

        setIsSpeechSupported(true);
      } catch (err) {
        console.error('Speech recognition initialization error:', err);
        setError('Speech recognition is not available on this device or browser.');
        setIsSpeechSupported(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSpeechRecognition();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
      if (stopTimeoutRef.current) {
        window.clearTimeout(stopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleHotkey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space' && isOpen && isSpeechSupported) {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleHotkey);
    return () => window.removeEventListener('keydown', handleHotkey);
  }, [isOpen, isSpeechSupported]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        stopListening();
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

  const toggleListening = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const startListening = () => {
    if (isInitializing) {
      setError('Speech recognition is still initializing. Please try again in a moment.');
      return;
    }

    if (!recognitionRef.current) {
      setError('Speech recognition is not available.');
      return;
    }

    setError(null);

    // Always stop first to ensure clean state
    try {
      recognitionRef.current.stop();
    } catch (err) {
      // Ignore any errors from stopping
    }

    // Clear any existing timeout
    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = undefined;
    }

    // Wait a moment before starting again
    setTimeout(() => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (err) {
        console.error('Error starting recognition:', err);
        setError('Failed to start speech recognition. Please try again.');
        setIsListening(false);
      }
    }, 100);
  };

  const stopListening = () => {
    setIsListening(false);
    if (stopTimeoutRef.current) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = undefined;
    }
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    stopListening();
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
        className="fixed inset-x-0 top-0 bg-white dark:bg-slate-800 shadow-lg p-4 animate-slide-down"
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
                placeholder={isSpeechSupported ? "Search for perfumes... (Ctrl + Space for voice search)" : "Search for perfumes..."}
                aria-label="Search for perfumes"
                className="w-full pl-12 pr-24 py-3 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                {isSpeechSupported && !isInitializing && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-1 rounded-full transition-all duration-300 ${
                      isListening 
                        ? 'bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 animate-pulse'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                  >
                    {isListening ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-2 text-sm text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {isListening && (
              <div className="mt-2 flex items-center justify-center space-x-1">
                <div className="flex items-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-4 bg-rose-500 dark:bg-rose-400 rounded-full animate-[wave_1s_ease-in-out_infinite]"
                      style={{
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300 ml-2">
                  Listening...
                </span>
              </div>
            )}

            {searchQuery && (
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 dark:border-white mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-serif text-lg text-slate-800 dark:text-white">{product.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{product.description}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm font-medium text-slate-800 dark:text-white">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="ml-2 px-2 py-1 text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-full">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-600 dark:text-slate-300">No products found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Floral', 'Citrus', 'Woody', 'Oriental'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-sm text-slate-700 dark:text-slate-300 transition-colors"
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