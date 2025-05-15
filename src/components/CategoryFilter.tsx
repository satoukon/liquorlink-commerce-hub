
import React from 'react';
import { Button } from '@/components/ui/button';
import { getCategories } from '../data/products';

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
  const categories = getCategories();

  return (
    <div className={`${vertical ? 'flex flex-col gap-2' : 'flex flex-wrap gap-2'} mb-6`}>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={`capitalize ${vertical ? 'justify-start' : ''}`}
          size={vertical ? "sm" : "default"}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
