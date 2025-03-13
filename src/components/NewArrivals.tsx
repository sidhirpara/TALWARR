import React, { useState, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  type: 'perfume' | 'freshener';
}

const NewArrivals = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleModalClose = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
      setIsImageLoaded(false);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
        setIsImageLoaded(false);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const optimizeImageUrl = (url: string, width: number = 400) => {
    return `${url}?w=${width}&q=75&auto=format,compress`;
  };

  const galleryImages: GalleryImage[] = [
    {
      id: 1,
      url: "https://sedralkhaleej.com/cdn/shop/files/RoyalEssence100ml_03514.png?v=1739484913&width=2048",
      title: "Royal Essence",
      type: "perfume"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
      title: "Midnight Bloom",
      type: "perfume"
    },
    {
      id: 3,
      url: "https://rukminim2.flixcart.com/image/850/1000/xif0q/perfume/8/m/q/100-ocean-breeze-perfume-fresh-and-exhilarating-scent-long-original-imagz3y4acpyygda.jpeg",
      title: "Ocean Breeze",
      type: "freshener"
    },
    {
      id: 4,
      url: "https://static-01.daraz.pk/p/6397f18cb9a66d255684953f0d77a7b0.jpg",
      title: "Golden Aura",
      type: "perfume"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539",
      title: "Forest Pine",
      type: "freshener"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1563170351-be82bc888aa4",
      title: "Velvet Rose",
      type: "perfume"
    },
    {
      id: 7,
      url: "https://www.myperfumeshop.ca/cdn/shop/products/156.80272689000_4_1000x1000_0350e33b-f619-42a4-b5a4-3fd64bd7cfed_1200x.webp",
      title: "Fresh Linen",
      type: "freshener"
    },
    {
      id: 8,
      url: "https://godofessence.com/cdn/shop/files/mystic-amber-for-unisex-203601.png",
      title: "Mystic Amber",
      type: "perfume"
    },
    {
      id: 9,
      url: "https://perfumeshark.com/cdn/shop/files/CitrusBurst-min_2395x.jpg",
      title: "Citrus Burst",
      type: "freshener"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-slate-800 mb-4">New Arrivals</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our latest collection of exquisite fragrances and premium car fresheners.
            Each piece is carefully curated to elevate your sensory experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              onClick={() => {
                setSelectedImage(image);
                setIsImageLoaded(false);
              }}
              className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <img
                src={optimizeImageUrl(image.url)}
                alt={image.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
                srcSet={`
                  ${optimizeImageUrl(image.url, 300)} 300w,
                  ${optimizeImageUrl(image.url, 600)} 600w,
                  ${optimizeImageUrl(image.url, 900)} 900w
                `}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-serif mb-2">{image.title}</h3>
                  <p className="text-sm font-light">
                    {image.type === 'perfume' ? 'Luxury Fragrance' : 'Premium Car Freshener'}
                  </p>
                  <span className="inline-block mt-2 text-xs tracking-wider bg-white/20 px-3 py-1 rounded-full">
                    AVAILABLE IN-STORE ONLY
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={handleModalClose}
          >
            <div className="relative w-full max-w-5xl mx-auto animate-fade-up">
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setIsImageLoaded(false);
                }}
                className="absolute -top-2 right-0 md:-right-2 text-white hover:text-rose-300 transition-colors z-10 bg-black/50 rounded-full p-1"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
                <div className="relative py-8">
                  <img
                    src={optimizeImageUrl(selectedImage.url, 1200)}
                    alt={selectedImage.title}
                    className={`w-full h-auto max-h-[70vh] object-contain transition-all duration-700 ${
                      isImageLoaded 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-95'
                    }`}
                    loading="eager"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif text-slate-800 mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-slate-600 mb-3">
                    {selectedImage.type === 'perfume'
                      ? 'Experience the essence of luxury with our newest fragrance addition.'
                      : "Transform your vehicle's atmosphere with our premium car freshener collection."}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-rose-600">
                      AVAILABLE IN-STORE ONLY
                    </span>
                    <span className="text-sm text-slate-500">
                      New Arrival {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;