
import React, { useState } from 'react';
import { ChevronLeft, Heart, Minus, Plus, MessageCircle, Smartphone } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, color: string) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  phone: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ 
  product, onBack, onAddToCart, onToggleWishlist, isWishlisted, phone 
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [inCartMode, setInCartMode] = useState(false);

  const generateOrderMessage = () => {
    return `Hello! I would like to order:
- Product: ${product.name}
- Detail: ${product.description}
- Color: ${selectedColor}
- Quantity: ${quantity}
- Price: ₹${product.sellingPrice}
- Total: ₹${product.sellingPrice * quantity}`;
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(generateOrderMessage());
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleSMSOrder = () => {
    const text = encodeURIComponent(generateOrderMessage());
    window.open(`sms:${phone}?body=${text}`, '_blank');
  };

  const handleAddToCart = () => {
    if (!inCartMode) {
      setInCartMode(true);
    } else {
      onAddToCart(product, quantity, selectedColor);
      alert('Added to cart!');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-900 text-slate-50">
      {/* Header Image */}
      <div className="relative h-96">
        <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 p-3 bg-slate-800/80 backdrop-blur rounded-full shadow-xl border border-slate-700"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <button 
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-6 right-4 p-3 bg-slate-800/80 backdrop-blur rounded-full shadow-xl border border-slate-700 transition-colors ${isWishlisted ? 'text-red-500' : 'text-slate-400'}`}
        >
          <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1 bg-slate-900 -mt-10 rounded-t-[40px] p-6 space-y-8 pb-32 relative z-10 border-t border-slate-800">
        <div>
          <h1 className="text-3xl font-black mb-3 text-white highlight-text">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-black text-blue-400">₹{product.sellingPrice}</span>
            <span className="text-slate-500 line-through font-bold">₹{product.originalPrice}</span>
            <div className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-black border border-blue-500/30">
              {Math.round((1 - product.sellingPrice / product.originalPrice) * 100)}% OFF
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Select Color</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map(color => (
              <button 
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-5 py-2.5 rounded-2xl border-2 transition-all text-xs font-black uppercase ${selectedColor === color ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-800 bg-slate-800 text-slate-400'}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Description</h3>
          <p className="text-slate-300 text-sm leading-relaxed font-medium highlight-text">{product.description}</p>
        </div>

        {/* Buttons Section */}
        <div className="space-y-4 pt-4">
          {/* Add To Cart with Inline Quantity Controls */}
          <div className="flex flex-col space-y-2">
            {!inCartMode ? (
              <button 
                onClick={() => setInCartMode(true)}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black uppercase tracking-wider border-2 border-slate-700 active:scale-95 transition-all shadow-xl"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center space-x-3 w-full">
                <div className="flex-1 flex items-center justify-between bg-slate-800 rounded-2xl p-2 border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-xl shadow-md active:scale-90 text-white"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-black text-xl text-blue-400">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-700 rounded-xl shadow-md active:scale-90 text-white"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase"
                >
                  OK
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setShowOrderOptions(true)}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase tracking-wider active:scale-95 transition-all shadow-xl shadow-emerald-500/10"
          >
            Order
          </button>

          <button 
            onClick={() => onToggleWishlist(product)}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider border-2 transition-all ${isWishlisted ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-slate-800 text-slate-500 bg-slate-800'}`}
          >
            Wish list
          </button>
        </div>
      </div>

      {/* Order Options Popup */}
      {showOrderOptions && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-slate-900 w-full max-w-md rounded-t-[40px] p-8 space-y-5 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl font-black text-center mb-4 text-white uppercase tracking-widest highlight-text">Select Order Mode</h2>
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full flex items-center justify-center space-x-4 bg-emerald-500 text-white py-5 rounded-3xl font-black uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <MessageCircle size={28} />
              <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
            </button>
            <button 
              onClick={handleSMSOrder}
              className="w-full flex items-center justify-center space-x-4 bg-blue-500 text-white py-5 rounded-3xl font-black uppercase shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Smartphone size={28} />
              <span>এসএমএস এর মাধ্যমে অর্ডার করুন</span>
            </button>
            <button 
              onClick={() => setShowOrderOptions(false)}
              className="w-full text-slate-500 py-3 font-black uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
