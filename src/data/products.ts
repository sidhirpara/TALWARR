export interface Product {
    id: string;
    name: string;
    description: string;
    category: 'New Arrivals' | 'Gallery' | 'Bestsellers';
    image: string;
    price: number;
  }
  
  export const products: Product[] = [
    {
      id: '1',
      name: 'Luxury Collection Perfume',
      description: 'Our signature fragrance line',
      category: 'Bestsellers',
      image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      price: 199.99
    },
    {
      id: '2',
      name: 'Premium Series Fragrance',
      description: 'Exclusive scents for the discerning',
      category: 'New Arrivals',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80',
      price: 249.99
    },
    {
      id: '3',
      name: 'Classic Collection',
      description: 'Timeless fragrances',
      category: 'Gallery',
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 149.99
    }
  ];