
import React, { useState } from 'react';
import { Minus, Plus, Trash2, MessageCircle, Smartphone, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQty: (id: string, color: string, delta: number) => void;
  onRemove: (id: string, color: string) => void;
  phone: string;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onUpdateQty, onRemove, phone }) => {
  const [showOrderOptions, setShowOrderOptions] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  const generateBulkOrderMessage = () => {
    let msg = `Hello! I would like to place an order for the following items:\n\n`;
    cart.forEach((item, index) => {
      msg += `${index + 1}. ${item.name}\n   - Color: ${item.selectedColor}\n   - Qty: ${item.quantity}\n   - Price: ₹${item.sellingPrice}\n   - Subtotal: ₹${item.sellingPrice * item.quantity}\n\n`;
    });
    msg += `--------------------------\nTotal Amount: ₹${total}`;
    return msg;
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(generateBulkOrderMessage());
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleSMSOrder = () => {
    const text = encodeURIComponent(generateBulkOrderMessage());
    window.open(`sms:${phone}?body=${text}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center space-y-6">
        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center text-slate-600 shadow-inner">
          <ShoppingBag size={56} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white highlight-text">Your cart is empty</h2>
          <p className="text-slate-400 font-bold">Add products to your cart and start shopping!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-black text-white highlight-text mt-4">My Cart</h1>
      
      <div className="space-y-5 pb-40">
        {cart.map((item) => (
          <div key={`${item.id}-${item.selectedColor}`} className="bg-slate-800 rounded-3xl p-4 border border-slate-700 shadow-xl flex space-x-5 hover:border-blue-500/50 transition-colors">
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-900 shadow-md">
              <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-sm text-white truncate mb-1 highlight-text">{item.name}</h3>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Color: {item.selectedColor}</p>
                <p className="text-blue-400 font-black text-lg">₹{item.sellingPrice}</p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-700">
                  <button onClick={() => onUpdateQty(item.id, item.selectedColor, -1)} className="p-1 text-slate-400 hover:text-blue-400 active:scale-90">
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-black text-white">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.id, item.selectedColor, 1)} className="p-1 text-slate-400 hover:text-blue-400 active:scale-90">
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={() => onRemove(item.id, item.selectedColor)} className="text-red-400/70 p-2 hover:text-red-400 transition-colors active:scale-90">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl p-8 border-t border-slate-800 rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-40">
        <div className="flex justify-between mb-6">
          <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Total Order</span>
          <span className="text-2xl font-black text-blue-400 highlight-text">₹{total}</span>
        </div>
        <button 
          onClick={() => setShowOrderOptions(true)}
          className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg uppercase tracking-wider active:scale-95 transition-all shadow-xl shadow-blue-500/20"
        >
          Place Order
        </button>
      </div>

      {showOrderOptions && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-end justify-center">
          <div className="bg-slate-900 w-full max-w-md rounded-t-[40px] p-8 space-y-5 border-t border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h2 className="text-xl font-black text-center mb-4 text-white uppercase tracking-widest highlight-text">Final Order</h2>
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

export default CartPage;
