
import React from 'react';
import { X, ShoppingCart, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart
  } = useCart();

  const handleCheckout = () => {
    toast.success('Order placed successfully!');
    clearCart();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card shadow-xl animate-fadeIn">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-4 opacity-30" />
                <p>Your cart is empty</p>
                <Button 
                  variant="link" 
                  onClick={() => setIsOpen(false)}
                  className="mt-2"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-20 w-20 flex-shrink-0 rounded overflow-hidden bg-black/5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>$5.00</span>
              </div>
              <Separator className="mb-4" />
              <div className="flex justify-between mb-6">
                <span className="font-medium">Total</span>
                <span className="font-bold">${(getCartTotal() + 5).toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
              >
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
