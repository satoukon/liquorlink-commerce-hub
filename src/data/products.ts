
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'beer' | 'wine' | 'spirits' | 'mixers';
  volume: number; // in ml
  alcoholContent: number; // percentage
  price: number;
  image: string;
  description: string;
  stock: number;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Red Wine',
    brand: 'Chateau Noir',
    category: 'wine',
    volume: 750,
    alcoholContent: 14.5,
    price: 29.99,
    image: '/placeholder.svg',
    description: 'A smooth red wine with notes of cherry, plum, and a hint of oak. Perfect for pairing with red meat or pasta dishes.',
    stock: 32,
    featured: true
  },
  {
    id: '2',
    name: 'Premium Vodka',
    brand: 'Crystal Clear',
    category: 'spirits',
    volume: 700,
    alcoholContent: 40,
    price: 34.99,
    image: '/placeholder.svg',
    description: 'Distilled five times for exceptional purity. Makes excellent martinis and cocktails. Smooth with a clean finish.',
    stock: 25,
    featured: true
  },
  {
    id: '3',
    name: 'Craft IPA',
    brand: 'Hoppy Brewers',
    category: 'beer',
    volume: 330,
    alcoholContent: 6.8,
    price: 3.99,
    image: '/placeholder.svg',
    description: 'A hoppy India Pale Ale with citrus and pine notes. Bold flavor profile with a refreshing bitter finish.',
    stock: 48
  },
  {
    id: '4',
    name: 'Tonic Water',
    brand: 'Fizz Co',
    category: 'mixers',
    volume: 500,
    alcoholContent: 0,
    price: 2.49,
    image: '/placeholder.svg',
    description: 'Premium tonic water with natural quinine. Perfect companion for gin and other spirits.',
    stock: 60
  },
  {
    id: '5',
    name: 'Single Malt Whiskey',
    brand: 'Highland Heritage',
    category: 'spirits',
    volume: 700,
    alcoholContent: 43,
    price: 56.99,
    image: '/placeholder.svg',
    description: 'Aged 12 years in oak barrels. Rich and complex with notes of caramel, vanilla, and a smoky finish.',
    stock: 18,
    featured: true
  },
  {
    id: '6',
    name: 'Champagne Brut',
    brand: 'Bubbly Elegance',
    category: 'wine',
    volume: 750,
    alcoholContent: 12,
    price: 49.99,
    image: '/placeholder.svg',
    description: 'Crisp and elegant with fine bubbles. Notes of green apple, citrus, and white flowers with a toasty finish.',
    stock: 15
  },
  {
    id: '7',
    name: 'Dark Rum',
    brand: 'Caribbean Gold',
    category: 'spirits',
    volume: 750,
    alcoholContent: 37.5,
    price: 24.99,
    image: '/placeholder.svg',
    description: 'Aged rum with rich molasses flavor. Perfect for cocktails or enjoying neat over ice.',
    stock: 22
  },
  {
    id: '8',
    name: 'Stout Beer',
    brand: 'Dark Knights',
    category: 'beer',
    volume: 440,
    alcoholContent: 5.2,
    price: 4.49,
    image: '/placeholder.svg',
    description: 'A creamy stout with chocolate and coffee notes. Smooth mouthfeel with a roasted malt character.',
    stock: 36
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getCategories = (): string[] => {
  return ['all', 'beer', 'wine', 'spirits', 'mixers'];
};
