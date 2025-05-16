
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { getProductById } from '../services/productService';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => id ? getProductById(id) : Promise.resolve(undefined),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Cart />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted h-8 w-32 mb-4 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted h-96 rounded"></div>
              <div className="space-y-4">
                <div className="bg-muted h-10 w-3/4 rounded"></div>
                <div className="bg-muted h-6 w-1/4 rounded"></div>
                <div className="bg-muted h-20 w-full rounded"></div>
                <div className="bg-muted h-8 w-1/2 rounded"></div>
                <div className="bg-muted h-12 w-full rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <Cart />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-8">Sorry, we couldn't find the product you're looking for.</p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2" />
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={handleBackClick}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.brand}</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                  />
                ))}
              </div>
              <span className="ml-2 text-muted-foreground">(42 reviews)</span>
            </div>
            
            <p className="text-lg">{product.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <div className="p-2 bg-card rounded-md">
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{product.volume}ml</p>
              </div>
              
              <div className="p-2 bg-card rounded-md">
                <p className="text-sm text-muted-foreground">Alcohol</p>
                <p className="font-medium">{product.alcoholContent}%</p>
              </div>
              
              <div className="p-2 bg-card rounded-md">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium capitalize">{product.category}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
              <p className={`${product.stock > 0 ? "text-green-600" : "text-red-600"} font-medium`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="w-full text-lg" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
