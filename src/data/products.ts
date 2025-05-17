
// This file is kept for backwards compatibility
// All data is now loaded from Supabase via the productService

import { Product, Category } from "../types/product";
import { 
  getProductById, 
  getProductsByCategory, 
  getFeaturedProducts, 
  getCategories,
  getCategoriesWithDetails 
} from "../services/productService";

// Export empty products array for backward compatibility
export const products: Product[] = [];

// Re-export functions from productService
export { 
  getProductById, 
  getProductsByCategory, 
  getFeaturedProducts, 
  getCategories,
  getCategoriesWithDetails 
};

// Export Product type for backward compatibility 
export type { Product, Category };
