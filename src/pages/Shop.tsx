
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { Button } from '@/components/ui/button';
import { getProductsByCategory, getCategories } from '../data/products';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const products = getProductsByCategory(selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Cart />
      
      {/* Hero Section */}
      <section className="bg-card py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Browse Our Collection
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover our vast selection of quality liquors, wines, beers, and mixers.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 flex-grow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="sticky top-24">
                <div className="bg-card p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <CategoryFilter
                      selectedCategory={selectedCategory}
                      onCategoryChange={handleCategoryChange}
                      vertical={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Filters - Mobile */}
            <div className="md:hidden mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Products</h2>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[50vh]">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                      <SheetDescription>
                        Select a category to filter products
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <CategoryFilter
                        selectedCategory={selectedCategory}
                        onCategoryChange={(category) => {
                          handleCategoryChange(category);
                        }}
                        vertical={true}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-grow">
              <div className="hidden md:flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Products ({products.length})</h2>
                <div className="text-sm text-muted-foreground">
                  Showing {products.length} products
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ShopPage;
