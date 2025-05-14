
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="overflow-hidden transition-card h-full flex flex-col">
        <div className="relative pt-[100%] bg-black/5">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-destructive text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <div className="text-sm text-muted-foreground mb-1">{product.brand}</div>
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm">
              <span>{product.volume}ml</span>
              <span className="mx-1">•</span>
              <span>{product.alcoholContent}%</span>
            </div>
            <div className="text-primary font-semibold">${product.price.toFixed(2)}</div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            className="w-full"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
