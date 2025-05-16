
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'beer' | 'wine' | 'spirits' | 'mixers' | string;
  volume: number; // in ml
  alcoholContent: number; // percentage
  price: number;
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
}
