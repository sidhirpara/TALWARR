import React from 'react';
import HeroImage from '../Assets/Pictures/Hero.jpg';

const Gallery = () => {
  const images = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Luxury Collection",
      description: "Our signature fragrance line"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      title: "Premium Series",
      description: "Exclusive scents for the discerning"
    },
    {
      id: 3,
      src: HeroImage,
      title: "Classic Collection",
      description: "Timeless fragrances"
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-rose-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-serif text-slate-800 mb-8 text-center">Our Gallery</h1>
        
        {/* Featured Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif text-slate-700 mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {images.map((image) => (
              <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-xl font-serif mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Showcase */}
        <div>
          <h2 className="text-2xl font-serif text-slate-700 mb-6">Product Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Product 1"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-serif text-slate-800 mb-2">Signature Collection</h3>
              <p className="text-slate-600">Experience the essence of luxury with our signature collection.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Product 2"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-serif text-slate-800 mb-2">Limited Edition</h3>
              <p className="text-slate-600">Discover our exclusive limited edition fragrances.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <img
                src={HeroImage}
                alt="Product 3"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-serif text-slate-800 mb-2">Premium Series</h3>
              <p className="text-slate-600">Indulge in our premium selection of fragrances.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;