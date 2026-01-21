
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Category, Product } from '../types';

interface HomeProps {
  categories: Category[];
  products: Product[];
  onProductClick: (product: Product) => void;
}

const HomePage: React.FC<HomeProps> = ({ categories, products, onProductClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (selectedCategory ? p.categoryId === selectedCategory : true)
  );

  // If search yields nothing, show others
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar - No banner, at top */}
      <div className="relative pt-2">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full pl-11 pr-4 py-4 bg-slate-800 text-white rounded-2xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none shadow-inner font-semibold"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {/* Categories - Circles */}
      <div className="flex space-x-5 overflow-x-auto no-scrollbar pb-2">
        <div 
          onClick={() => setSelectedCategory(null)}
          className="flex flex-col items-center space-y-2 cursor-pointer min-w-[70px]"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${!selectedCategory ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-slate-700 bg-slate-800'}`}>
            <span className="text-xs font-black uppercase text-white highlight-text">All</span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 highlight-text">All Items</span>
        </div>
        {categories.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat.id)}
            className="flex flex-col items-center space-y-2 cursor-pointer min-w-[70px]"
          >
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${selectedCategory === cat.id ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-slate-700 bg-slate-800'}`}>
              <img src={cat.photo} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 highlight-text truncate max-w-[65px]">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div>
        <h2 className="text-lg font-black mb-4 text-white uppercase tracking-wider highlight-text">
          {filteredProducts.length === 0 && searchQuery !== '' ? 'Similar Products' : 'Our Products'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {displayProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden cursor-pointer active:scale-95 transition-all hover:border-blue-500"
              onClick={() => onProductClick(product)}
            >
              <div className="h-44 overflow-hidden bg-slate-900">
                <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
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
        {displayProducts.length === 0 && (
          <div className="text-center py-20 text-slate-500 font-bold">
            No products found yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
