
import React, { useState } from 'react';
import { Lock, Plus, Image as ImageIcon, Tag, Box, DollarSign, Palette, FileText } from 'lucide-react';
import { Category, Product } from '../types';

interface AdminPageProps {
  categories: Category[];
  onAddCategory: (name: string, photo: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ categories, onAddCategory, onAddProduct }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'cat' | 'prod'>('cat');

  // Category Form
  const [catName, setCatName] = useState('');
  const [catPhoto, setCatPhoto] = useState('');

  // Product Form
  const [prodName, setProdName] = useState('');
  const [prodPhoto, setProdPhoto] = useState('');
  const [prodCatId, setProdCatId] = useState('');
  const [prodOrigPrice, setProdOrigPrice] = useState('');
  const [prodSellPrice, setProdSellPrice] = useState('');
  const [prodColors, setProdColors] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Jishu@7433732006') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password');
    }
  };

  const processImage = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName || !catPhoto) {
      alert('Please provide name and photo');
      return;
    }
    onAddCategory(catName, catPhoto);
    setCatName('');
    setCatPhoto('');
    alert('Category Added Successfully to Cloud!');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPhoto || !prodCatId || !prodOrigPrice || !prodSellPrice || !prodColors || !prodDesc) {
      alert('Please fill all fields');
      return;
    }
    onAddProduct({
      name: prodName,
      photo: prodPhoto,
      categoryId: prodCatId,
      originalPrice: Number(prodOrigPrice),
      sellingPrice: Number(prodSellPrice),
      colors: prodColors.split(',').map(c => c.trim()),
      description: prodDesc
    });
    setProdName('');
    setProdPhoto('');
    setProdCatId('');
    setProdOrigPrice('');
    setProdSellPrice('');
    setProdColors('');
    setProdDesc('');
    alert('Product Published to Cloud!');
  };

  if (!isAuthenticated) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[80vh] space-y-10">
        <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 border-2 border-blue-500/30 shadow-2xl">
          <Lock size={48} />
        </div>
        <div className="w-full space-y-6">
          <h2 className="text-3xl font-black text-center uppercase tracking-widest text-white highlight-text">alart Panel</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Admin Password" 
              className="w-full px-5 py-5 rounded-2xl bg-slate-800 text-white border-2 border-slate-700 outline-none focus:border-blue-500 transition-all font-bold text-center"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-wider shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              Unlock
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-black text-white uppercase tracking-widest mt-4 text-center highlight-text">Management Center</h1>
      
      <div className="flex bg-slate-800 p-1.5 rounded-[2rem] border border-slate-700">
        <button 
          onClick={() => setActiveTab('cat')}
          className={`flex-1 py-3.5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'cat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-50'}`}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('prod')}
          className={`flex-1 py-3.5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all ${activeTab === 'prod' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
        >
          Products
        </button>
      </div>

      {activeTab === 'cat' ? (
        <form onSubmit={handleAddCategory} className="space-y-6 animate-in fade-in duration-500">
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <Tag size={14} /> <span>Category Name</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. Watches"
              className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none focus:border-blue-500 transition-all font-bold"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center space-x-2">
              <ImageIcon size={14} /> <span>Category Photo (Gallery)</span>
            </label>
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*"
                className="hidden" 
                id="cat-img-input"
                onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0], setCatPhoto)}
              />
              <label 
                htmlFor="cat-img-input"
                className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors"
              >
                {catPhoto ? (
                  <img src={catPhoto} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <ImageIcon size={32} className="text-slate-500 mb-2" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tap to Choose Photo</span>
                  </>
                )}
              </label>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-wider flex items-center justify-center space-x-3 shadow-xl shadow-blue-500/10">
            <Plus size={22} />
            <span>Add Category</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleAddProduct} className="space-y-5 animate-in fade-in duration-500">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Product Name</label>
            <input 
              type="text" 
              placeholder="Full product title"
              className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none focus:border-blue-500 font-bold"
              value={prodName}
              onChange={(e) => setProdName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Category</label>
            <select 
              className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none focus:border-blue-500 font-bold appearance-none"
              value={prodCatId}
              onChange={(e) => setProdCatId(e.target.value)}
            >
              <option value="">Choose Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Original (MRP)</label>
              <input 
                type="number" 
                placeholder="1999"
                className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none font-bold"
                value={prodOrigPrice}
                onChange={(e) => setProdOrigPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Selling Price</label>
              <input 
                type="number" 
                placeholder="1499"
                className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none font-bold"
                value={prodSellPrice}
                onChange={(e) => setProdSellPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Product Image (Gallery)</label>
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              id="prod-img-input"
              onChange={(e) => e.target.files?.[0] && processImage(e.target.files[0], setProdPhoto)}
            />
            <label 
              htmlFor="prod-img-input"
              className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 bg-slate-800/50 rounded-2xl cursor-pointer hover:border-blue-500 transition-colors"
            >
              {prodPhoto ? (
                <img src={prodPhoto} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <>
                  <ImageIcon size={32} className="text-slate-500 mb-2" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Product Photo</span>
                </>
              )}
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Colors (e.g. Red, Blue, Black)</label>
            <input 
              type="text" 
              placeholder="Comma separated"
              className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none font-bold"
              value={prodColors}
              onChange={(e) => setProdColors(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea 
              rows={4}
              placeholder="Write something about the product..."
              className="w-full px-5 py-4 bg-slate-800 text-white rounded-2xl border border-slate-700 outline-none resize-none font-bold"
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
            />
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-wider shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">
            Publish to Cloud
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPage;
