
import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../services/productService';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  vertical?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  vertical = false
}) => {
  const { data: categories = ['all'], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  if (isLoading) {
    return (
      <div className={`flex ${vertical ? 'flex-col space-y-2' : 'flex-row flex-wrap gap-2'}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-muted h-9 w-20 animate-pulse rounded-md"></div>
        ))}
      </div>
    );
  }
  
  return (
    <div className={`flex ${vertical ? 'flex-col space-y-2' : 'flex-row flex-wrap gap-2'}`}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          className={`capitalize ${vertical ? 'justify-start' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
