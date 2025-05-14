
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { Button } from '@/components/ui/button';
import { getProductById, getProductsByCategory, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity(prev => Math.min(product.stock, prev + 1));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card rounded-lg overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div>
            <div className="mb-2">
              <span className="text-sm text-muted-foreground capitalize">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-lg text-muted-foreground mb-4">{product.brand}</div>
            
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="ml-4 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                  Low Stock
                </span>
              )}
              {product.stock === 0 && (
                <span className="ml-4 bg-destructive text-white text-xs px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1 || product.stock === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Volume</div>
                  <div className="font-medium">{product.volume}ml</div>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Alcohol Content</div>
                  <div className="font-medium">{product.alcoholContent}%</div>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Stock</div>
                <div className="font-medium">{product.stock} available</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Product Description</h2>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
        
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
