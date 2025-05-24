
import React, { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Wine } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserMenu from './UserMenu';

const Navbar: React.FC = () => {
  const { getCartCount, setIsOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const cartCount = getCartCount();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      closeMenu();
    }
  };

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
              <Wine className="h-6 w-6" />
              LiquorLink
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="text"
                placeholder="Search products..."
                className="pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </form>
            <div className="hidden md:flex space-x-4">
              <Link to="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-foreground hover:text-primary transition-colors">
                Shop
              </Link>
              <Link to="/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="relative mr-2"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            <UserMenu />
            
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-2 pb-4 border-t border-border animate-fadeIn">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                className="pr-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </form>
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary py-2"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-foreground hover:text-primary py-2"
                onClick={closeMenu}
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="text-foreground hover:text-primary py-2"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-foreground hover:text-primary py-2"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
