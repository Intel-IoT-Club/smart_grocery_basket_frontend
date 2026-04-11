"use client";

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GroceryBasket from '../components/GroceryBasket';
import QRScanner from '../components/QRScanner';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

// Use the Product interface from types with all necessary fields
interface Product {
  productId: string;
  name: string;
  mrpPrice: number;
  image: string;
  discounts?: string;
  category: string;
  stock?: number;
  expiryDate?: string;
}

/**
 * Main application page component
 */
export default function Home() {
  const [productCallback, setProductCallback] = useState<((product: Product) => void) | null>(null);
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  // Optional: Redirect owners to their dashboard if they land here
  useEffect(() => {
    if (isAuthenticated && user?.role === 'owner') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  /**
   * Handle product scanning callback registration
   */
  const handleScannedCallback = useCallback((handler: (product: Product) => void) => {
    setProductCallback(() => handler);
  }, []);
  
  /**
   * Handle product scanned event
   */
  const handleProductScanned = useCallback((product: Product) => {
    if (productCallback && typeof productCallback === 'function') {
      productCallback(product);
    }
  }, [productCallback]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // NOT LOGGED IN: Amazing Creative Landing Page
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-[#030014] flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
        {/* Cinematic Gradient Backgrounds */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-fuchsia-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01OS41IDBoLjV2NjBoLS41ek0wIDU5LjVoNjB2LjVIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

        {/* Floating Abstract UI Elements (Desktop Only) */}
        <div className="hidden lg:flex absolute left-[8%] top-[25%] flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-2xl skew-y-[-6deg] hover:skew-y-0 hover:-translate-y-4 transition-all duration-700 ease-out z-20">
          <div className="flex items-center justify-between w-48 mb-2">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(34,197,94,0.3)]">🥑</div>
                <div>
                   <p className="text-white text-sm font-semibold">Avocado</p>
                   <p className="text-green-400 text-xs font-medium">Added to cart</p>
                </div>
             </div>
             <span className="text-white text-sm font-bold">₹150</span>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[100%] drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div></div>
        </div>

        <div className="hidden lg:flex absolute right-[5%] bottom-[25%] flex-col p-5 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-white/10 shadow-2xl skew-y-[4deg] hover:skew-y-0 hover:-translate-y-4 transition-all duration-700 ease-out z-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
            </div>
            <div>
              <p className="text-indigo-300 text-xs uppercase tracking-wider font-semibold">Scanner Active</p>
              <p className="text-white font-bold text-sm">Ready for item</p>
            </div>
          </div>
          <div className="w-56 h-28 bg-black/40 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden group">
             <div className="w-full h-0.5 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)] animate-ping absolute top-1/2 -translate-y-1/2 opacity-70"></div>
             <p className="text-white/20 text-xs font-mono tracking-widest mt-8">ALIGN BARCODE HERE</p>
          </div>
        </div>

        {/* Global Navigation */}
        <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20 transition-transform hover:scale-110 cursor-pointer">
                 <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">SmartBasket</span>
           </div>
           <div className="flex items-center gap-6">
             <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-semibold">Sign In</Link>
             <Link 
               href="/signup" 
               className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none hover:scale-105 transition-transform"
             >
               <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#c084fc_0%,#6366f1_50%,#c084fc_100%)]" />
               <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950/90 px-6 py-1 text-sm font-semibold text-white backdrop-blur-3xl transition-colors hover:bg-slate-950/70">
                 Join Now
               </span>
             </Link>
           </div>
        </nav>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-16 pb-20">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-indigo-300 text-sm mb-8 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
            </span>
            <span className="font-semibold tracking-wide">Next-Gen Retail Experience</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-purple-400 mb-6 tracking-tighter drop-shadow-2xl leading-[1.1] max-w-4xl mx-auto">
            Checkout visually.<br />
            No lines. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 animate-pulse">No waiting.</span>
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light drop-shadow">
            Transform your smartphone into an intelligent shopping sidekick. Scan items as you go, manage your dynamic cart, and breeze out of the store without the hassle.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
            <Link 
              href="/login" 
              className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700 ease-in-out" />
              Start Shopping Experience
            </Link>
          </div>

          {/* Epic Bento Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-28 max-w-6xl w-full text-left mx-auto relative z-20">
            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-indigo-400/40 rounded-[2rem] transition-all duration-500 overflow-hidden relative shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
              <div className="relative z-10 w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><rect x="7" y="7" width="3" height="10"/><rect x="14" y="7" width="3" height="10"/></svg>
              </div>
              <h3 className="text-white font-bold text-2xl mb-3 tracking-tight">Instant Barcode Scanning</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Turn your camera into an enterprise-grade POS scanner. Add products natively via lightning-fast edge detection perfectly syncing to your cart.</p>
            </div>
            
            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-purple-400/40 rounded-[2rem] transition-all duration-500 overflow-hidden relative shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
              <div className="relative z-10 w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-white font-bold text-2xl mb-3 tracking-tight">Smart Live Sync</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Your cart totals update in real-time with live tax and discount calculations as you drop items in the basket. No surprises.</p>
            </div>

            <div className="group p-8 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-xl border border-white/10 hover:border-pink-400/40 rounded-[2rem] transition-all duration-500 overflow-hidden relative shadow-2xl hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 blur-[50px] rounded-full group-hover:bg-pink-500/20 transition-colors" />
              <div className="relative z-10 w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 text-pink-400 border border-pink-500/20 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-white font-bold text-2xl mb-3 tracking-tight">Enterprise Security</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Role-based access protects shop owners' backend systems while delivering a blazing fast checkout experience for all customers.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // LOGGED IN (CUSTOMER): Show the Shopping Basket
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-medium text-white text-center">
          Smart Grocery Basket
        </h1>
        <p className="text-sm text-gray-400 text-center mt-1">
          Scan products to add them to your basket
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <div className="grid gap-4 lg:grid-cols-2 h-[calc(100vh-8rem)]">
          <QRScanner onScan={handleProductScanned} />
          <GroceryBasket onProductScanned={handleScannedCallback} />
        </div>
      </main>
    </div>
  );
}