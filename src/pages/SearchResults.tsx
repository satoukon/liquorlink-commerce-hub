
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import { getProductsWithStock } from '../services/productService';
import { Product } from '@/types/product';
import { Loader2 } from 'lucide-react';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Fetch all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'search'],
    queryFn: getProductsWithStock,
  });

  // Filter products based on the search query
  const filteredProducts = products.filter((product: Product) => {
    const searchTerm = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm) ||
      product.description?.toLowerCase().includes(searchTerm) ||
      product.category?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      <section className="py-8 flex-grow">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">
            Search Results for "{query}"
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">No products found matching your search.</p>
              <p className="text-sm text-muted-foreground">Try using different keywords or browse our categories.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResults;
