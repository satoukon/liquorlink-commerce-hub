
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Cart from '../components/Cart';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { getProductsByCategory, getFeaturedProducts } from '../data/products';

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const featuredProducts = getFeaturedProducts();
  const filteredProducts = getProductsByCategory(selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      {/* Hero Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Spirits Delivered to Your Door
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover our vast collection of quality liquors, wines, and mixers.
              Fast delivery, exceptional selection.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link to="/about">About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="link" asChild>
              <Link to="/products">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse By Category */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Browse Products</h2>
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onCategoryChange={handleCategoryChange} 
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filteredProducts.length > 8 && (
            <div className="text-center mt-8">
              <Button asChild>
                <Link to={`/products?category=${selectedCategory}`}>
                  View All {selectedCategory} Products
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">About LiquorLink</h2>
              <p className="text-muted-foreground mb-4">
                LiquorLink is your premium destination for fine spirits, wines, craft beers, and cocktail essentials.
                We pride ourselves on offering a curated selection of the highest quality beverages from around the world.
              </p>
              <p className="text-muted-foreground mb-6">
                With fast delivery and expert recommendations, we bring the liquor store experience to the comfort of your home.
              </p>
              <Button asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
            <div className="bg-muted rounded-lg h-80 flex items-center justify-center">
              <span className="text-muted-foreground">Store Image</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
