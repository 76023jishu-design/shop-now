
export interface Category {
  id: string;
  name: string;
  photo: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  photo: string;
  originalPrice: number;
  sellingPrice: number;
  colors: string[];
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

export type View = 'home' | 'cart' | 'wishlist' | 'alert' | 'product-detail';

export interface AppState {
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  selectedProduct: Product | null;
}
