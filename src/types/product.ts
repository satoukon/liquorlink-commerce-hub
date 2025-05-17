
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'beer' | 'wine' | 'spirits' | 'mixers' | string;
  category_id?: string;
  volume: number; // in ml
  alcoholContent: number; // percentage
  price: number;
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
