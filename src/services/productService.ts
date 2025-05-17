import { supabase } from "@/integrations/supabase/client";
import { Product, Category } from "@/types/product";

export const fetchProducts = async (): Promise<Product[]> => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, categories(name, id)");

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  // Transform the data to match our Product type
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    brand: product.brand || "",
    category: product.categories?.name || "mixers",
    category_id: product.category_id || product.categories?.id,
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
  
  // Filter by category name
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await getProductsWithStock();
  return products.filter(product => product.featured);
};

export const getCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order('name');

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  // Extract unique categories
  const categories = data.map(item => item.name);
  return ['all', ...categories];
};

export const getCategoriesWithDetails = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order('name');

  if (error) {
    console.error("Error fetching detailed categories:", error);
    throw error;
  }

  return data as Category[];
};
