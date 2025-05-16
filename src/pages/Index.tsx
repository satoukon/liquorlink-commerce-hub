
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductCard from '../components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../services/productService';

const HomePage: React.FC = () => {
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: getFeaturedProducts,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      {/* Hero Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Premium Drinks, Delivered to Your Door
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our handpicked selection of the finest beers, wines, and spirits with fast delivery to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">Shop Now</Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary flex items-center hover:underline">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-muted rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse By Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link to="/products?category=wine" className="group">
              <div className="bg-card rounded-lg p-8 text-center transition-shadow hover:shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍷</span>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary">Wines</h3>
              </div>
            </Link>
            
            <Link to="/products?category=beer" className="group">
              <div className="bg-card rounded-lg p-8 text-center transition-shadow hover:shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍺</span>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary">Beers</h3>
              </div>
            </Link>
            
            <Link to="/products?category=spirits" className="group">
              <div className="bg-card rounded-lg p-8 text-center transition-shadow hover:shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥃</span>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary">Spirits</h3>
              </div>
            </Link>
            
            <Link to="/products?category=mixers" className="group">
              <div className="bg-card rounded-lg p-8 text-center transition-shadow hover:shadow-md">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍹</span>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary">Mixers</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Get your favorite drinks delivered to your doorstep within 24 hours.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🏆</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Selection</h3>
              <p className="text-muted-foreground">Curated selection of high-quality alcoholic beverages from around the world.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💯</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Satisfaction Guaranteed</h3>
              <p className="text-muted-foreground">Not satisfied? We offer hassle-free returns and refunds.</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;
