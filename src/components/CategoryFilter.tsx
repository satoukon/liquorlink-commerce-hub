
import React from 'react';
import { Button } from '@/components/ui/button';
import { getCategories } from '../data/products';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange 
}) => {
  const categories = getCategories();

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className="capitalize"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
