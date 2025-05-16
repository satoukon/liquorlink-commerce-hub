
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  // Transform the data to match our Product type
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand || "",
    category: product.category as any || "mixers",
    volume: product.volume || 0,
    alcoholContent: product.alcohol_content || 0,
    price: product.price,
    image: product.image || "/placeholder.svg",
    description: product.description || "",
    stock: 0, // Default stock, will be updated from inventory
    featured: false
  }));
};

export const fetchInventory = async (): Promise<Record<string, number>> => {
  const { data: inventory, error } = await supabase
    .from("inventory")
    .select("*");

  if (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }

  // Create a map of product_id to quantity
  const stockMap: Record<string, number> = {};
  inventory.forEach((item) => {
    stockMap[item.product_id] = item.quantity;
  });

  return stockMap;
};

export const getProductsWithStock = async (): Promise<Product[]> => {
  const products = await fetchProducts();
  const stockMap = await fetchInventory();

  // Combine products with their stock quantities
  return products.map(product => ({
    ...product,
    stock: stockMap[product.id] || 0,
    // Mark as featured if price is above average
    featured: product.price > 30
  }));
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const products = await getProductsWithStock();
  return products.find(product => product.id === id);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const products = await getProductsWithStock();
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await getProductsWithStock();
  return products.filter(product => product.featured);
};

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("category");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  // Extract unique categories
  const categories = new Set<string>(data.map(item => item.category).filter(Boolean));
  return ['all', ...Array.from(categories)];
};
