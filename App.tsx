
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc } from "firebase/firestore";
import { Home, ShoppingCart, Heart, Bell } from 'lucide-react';
import { Category, Product, CartItem, View } from './types';
import HomePage from './pages/Home';
import CartPage from './pages/Cart';
import WishlistPage from './pages/Wishlist';
import AdminPage from './pages/Admin';
import ProductDetail from './pages/ProductDetail';

// STEP: Paste your Firebase config object here from Firebase Console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PHONE_NUMBER = '9679683228';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Categories and Products from Firestore Real-time
  useEffect(() => {
    const unsubCats = onSnapshot(collection(db, "categories"), (snapshot) => {
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
    });

    const unsubProds = onSnapshot(collection(db, "products"), (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setIsLoading(false);
    });

    // Local state for user's personal cart/wishlist
    const savedCart = localStorage.getItem('user_cart');
    const savedWish = localStorage.getItem('user_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWish) setWishlist(JSON.parse(savedWish));

    return () => { unsubCats(); unsubProds(); };
  }, []);

  useEffect(() => {
    localStorage.setItem('user_cart', JSON.stringify(cart));
    localStorage.setItem('user_wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const addToCart = (product: Product, quantity: number, color: string) => {
    const existing = cart.find(item => item.id === product.id && item.selectedColor === color);
    if (existing) {
      setCart(cart.map(item => 
        (item.id === product.id && item.selectedColor === color) 
        ? { ...item, quantity: item.quantity + quantity } 
        : item
      ));
    } else {
      setCart([...cart, { ...product, quantity, selectedColor: color }]);
    }
  };

  const updateCartQuantity = (id: string, color: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedColor === color) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string, color: string) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color)));
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const addCategory = async (name: string, photo: string) => {
    try {
      await addDoc(collection(db, "categories"), { name, photo });
    } catch (e) {
      alert("Error adding category: " + e);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, "products"), product);
    } catch (e) {
      alert("Error adding product: " + e);
    }
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Syncing with Cloud...</p>
      </div>
    );

    switch (view) {
      case 'home':
        return <HomePage categories={categories} products={products} onProductClick={handleProductClick} />;
      case 'cart':
        return <CartPage cart={cart} onUpdateQty={updateCartQuantity} onRemove={removeFromCart} phone={PHONE_NUMBER} />;
      case 'wishlist':
        return <WishlistPage wishlist={wishlist} onProductClick={handleProductClick} />;
      case 'alert':
        return <AdminPage categories={categories} onAddCategory={addCategory} onAddProduct={addProduct} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setView('home')} 
            onAddToCart={addToCart} 
            onToggleWishlist={toggleWishlist}
            isWishlisted={wishlist.some(p => p.id === selectedProduct.id)}
            phone={PHONE_NUMBER}
          />
        ) : null;
      default:
        return <HomePage categories={categories} products={products} onProductClick={handleProductClick} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-2xl bg-slate-900 overflow-hidden flex flex-col text-slate-50">
      <div className="flex-1 overflow-y-auto pb-4">
        {renderContent()}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-800/90 backdrop-blur-md border-t border-slate-700 h-16 flex items-center justify-around px-4 z-50">
        <button onClick={() => setView('home')} className={`flex flex-col items-center justify-center space-y-1 transition-colors ${view === 'home' || view === 'product-detail' ? 'text-blue-400' : 'text-slate-400'}`}>
          <Home size={22} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setView('cart')} className={`flex flex-col items-center justify-center space-y-1 transition-colors ${view === 'cart' ? 'text-blue-400' : 'text-slate-400'}`}>
          <div className="relative">
            <ShoppingCart size={22} />
            {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </div>
          <span className="text-[10px] font-bold">Cart</span>
        </button>
        <button onClick={() => setView('wishlist')} className={`flex flex-col items-center justify-center space-y-1 transition-colors ${view === 'wishlist' ? 'text-blue-400' : 'text-slate-400'}`}>
          <Heart size={22} />
          <span className="text-[10px] font-bold">Wishlist</span>
        </button>
        <button onClick={() => setView('alert')} className={`flex flex-col items-center justify-center space-y-1 transition-colors ${view === 'alert' ? 'text-blue-400' : 'text-slate-400'}`}>
          <Bell size={22} />
          <span className="text-[10px] font-bold uppercase tracking-widest">alart</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
