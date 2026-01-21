
import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';

interface WishlistPageProps {
  wishlist: Product[];
  onProductClick: (product: Product) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ wishlist, onProductClick }) => {
  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center space-y-6">
        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-red-400 shadow-inner">
          <Heart size={56} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white highlight-text">Wishlist Empty</h2>
          <p className="text-slate-400 font-bold">Keep track of products you like here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-black text-white highlight-text mt-4">My Wishlist</h1>
      
      <div className="grid grid-cols-2 gap-4">
        {wishlist.map(product => (
          <div 
            key={product.id} 
            className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden cursor-pointer active:scale-95 transition-all hover:border-red-500/50"
            onClick={() => onProductClick(product)}
          >
            <div className="h-44 overflow-hidden relative">
              <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 p-1.5 bg-slate-900/60 backdrop-blur rounded-full">
                <Heart size={18} fill="#ef4444" className="text-red-500" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-bold text-white truncate mb-2 highlight-text">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-blue-400 font-black text-base">₹{product.sellingPrice}</span>
                <span className="text-slate-500 line-through text-[10px] font-bold">₹{product.originalPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
