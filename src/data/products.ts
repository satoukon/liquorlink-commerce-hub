
// This file is kept for backwards compatibility
// All data is now loaded from Supabase via the productService

import { Product } from "../types/product";
import { getProductById, getProductsByCategory, getFeaturedProducts, getCategories } from "../services/productService";

// Export empty products array for backward compatibility
export const products: Product[] = [];

// Re-export functions from productService
export { getProductById, getProductsByCategory, getFeaturedProducts, getCategories };

// Export Product type for backward compatibility 
export type { Product };
