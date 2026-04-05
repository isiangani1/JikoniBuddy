"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadBuyerState, updateCartQty, computeSubtotal } from "@/data/buyerStorage";

export default function CartDrawer({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const refreshCart = () => {
    const { cart } = loadBuyerState();
    setCartItems(cart);
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.qty, 0));
    setCartTotal(computeSubtotal(cart));
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener("cart-updated", refreshCart);
    return () => window.removeEventListener("cart-updated", refreshCart);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-[#12021f] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        <header className="p-6 border-b border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white m-0">Your Cart</h2>
            <span className="bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-bold border border-purple-500/30">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {!cartItems.length ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-50">
              <div className="text-5xl">🛒</div>
              <p className="text-lg font-medium">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Go find something tasty
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6 m-0 p-0">
              {cartItems.map((item) => (
                <li key={item.id} className="flex gap-4 group">
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-semibold m-0 text-base">{item.name}</h3>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider font-bold m-0 mt-0.5">{item.sellerName}</p>
                      </div>
                      <p className="text-purple-300 font-bold m-0 text-sm">KES {item.price}</p>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-white transition-colors disabled:opacity-30"
                          onClick={() => updateCartQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-white font-medium text-sm">{item.qty}</span>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 text-white transition-colors"
                          onClick={() => updateCartQty(item.id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => updateCartQty(item.id, 0)}
                        className="p-2 text-white/40 hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="p-6 bg-white/5 border-t border-white/10 flex flex-col gap-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-white/60 font-medium">Subtotal</span>
              <span className="text-white font-bold tracking-tight">KES {cartTotal}</span>
            </div>
            <p className="text-white/40 text-xs m-0">Delivery and taxes calculated at checkout.</p>
            <Link 
              href="/buyer/checkout" 
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-bold transition-all text-center shadow-lg shadow-purple-500/20 active:scale-95"
            >
              Secure Checkout
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
