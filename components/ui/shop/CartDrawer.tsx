'use client';

import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, Send, User } from 'lucide-react';
import { useCart } from './CartContext';
import { createClient } from '@/infrastructure/supabase/client';
import { Button } from '@/components/ui/Button';
import { Profile } from '@/domain/entities';

export const CartDrawer: React.FC = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
  } = useCart();

  const [shippingName, setShippingName] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load authenticated profile name if logged in
  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (prof) {
          setProfile(prof);
          setShippingName(`${prof.first_name} ${prof.last_name || ''}`.trim());
        }
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [isCartOpen]); // Refresh profile when opening panel

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    const nameToUse = shippingName.trim() || (profile ? `${profile.first_name} ${profile.last_name}` : 'Cliente');
    
    setIsSubmitting(true);
    try {
      // 1. Save order to Supabase SQL Database (Extra 3)
      const orderItems = cartItems.map(item => ({
        id: item.product_id,
        name: item.product?.name || 'Parrilla J3RACKS',
        price: item.product?.price || 0,
        quantity: item.quantity,
      }));
      const total = getCartTotal();

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          total,
        }),
      });

      if (!response.ok) {
        console.warn('Could not save order history record, continuing to checkout');
      }

      // 2. Build WhatsApp Message Body
      let message = `Hola J3RACKS! Quiero hacer el siguiente pedido:\n\n`;
      cartItems.forEach((item) => {
        const pName = item.product?.name || 'Parrilla';
        const pPrice = item.product?.price || 0;
        const subtotal = pPrice * item.quantity;
        message += `${item.quantity}x ${pName} — S/ ${pPrice.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (S/ ${subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })})\n\n`;
      });
      message += `TOTAL: S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}\n\n`;
      message += `Mi nombre: ${nameToUse}`;

      // 3. Trigger redirect to business WhatsApp number
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51997444846';
      const encodedMsg = encodeURIComponent(message);
      const url = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

      // Clear local cart
      clearCart();
      setIsCartOpen(false);

      // Open redirection
      window.open(url, '_blank');
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Panel panel info */}
        <div className="w-screen max-w-md bg-brand-coal border-l border-brand-ash/60 text-white flex flex-col h-full shadow-2xl">
          {/* Header */}
          <div className="px-4 py-5 border-b border-brand-ash/60 flex items-center justify-between sm:px-6 bg-brand-dark/40">
            <h2 className="text-xl font-bold uppercase tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-fire" />
              Carrito de Parrillas
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded p-1.5 hover:bg-brand-ash text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ShoppingBag className="w-16 h-16 text-brand-ash mb-4" />
                <p className="text-lg font-bold text-gray-300">Tu carrito está vacío</p>
                <p className="text-sm text-gray-500 mt-1 max-w-[240px]">
                  Agrega nuestras parrillas diseñadas de acero de calidad para empezar.
                </p>
                <Button 
                  size="sm" 
                  className="mt-6" 
                  onClick={() => setIsCartOpen(false)}
                >
                  Explorar Catálogo
                </Button>
              </div>
            ) : (
              cartItems.map((item) => {
                const p = item.product || { name: 'Parrilla J3RACKS', price: 0, images: [] };
                const imgUrl = p.images && p.images.length > 0 ? p.images[0].url : null;
                const price = p.price || 0;

                return (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 rounded bg-brand-dark/40 border border-brand-ash/40 relative group"
                  >
                    {/* Tiny representation image */}
                    <div className="relative w-16 h-16 bg-black rounded overflow-hidden shrink-0">
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt={p.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-ash text-gray-500 font-bold text-xs">
                          J3R
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between gap-1">
                          <h4 className="text-sm font-bold uppercase tracking-wide text-gray-200 line-clamp-1">
                            {p.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-gray-500 hover:text-brand-ember absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                            title="Eliminar artículo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-brand-fire">
                          S/ {price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 bg-brand-ash/50 rounded p-1 border border-brand-ash/40">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-5 h-5 rounded hover:bg-brand-dark flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold px-1.5 text-center min-w-4 text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-5 h-5 rounded hover:bg-brand-dark flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-medium text-gray-400">
                          Subtotal: <strong className="text-white">S/ {(price * item.quantity).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout controls footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-brand-ash/60 p-4 sm:p-6 bg-brand-dark/65 space-y-4">
              {/* Shipping client Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-fire" />
                  Nombre de contacto
                </label>
                <input
                  type="text"
                  placeholder="Escribe tu nombre para el pedido"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-brand-coal/90 border border-brand-ash rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-fire"
                />
              </div>

              {/* Total Display */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-400 font-bold uppercase tracking-wide">
                  Total Del Pedido
                </span>
                <span className="text-2xl font-extrabold text-white">
                  S/ {getCartTotal().toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* Whatsapp Trigger Button */}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="flex items-center justify-center gap-2"
                id="cart-checkout-cta"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'Procesando...' : 'HACER PEDIDO POR WHATSAPP'}
              </Button>

              <p className="text-[10px] text-gray-500 text-center uppercase tracking-wide">
                Te redirigiremos a WhatsApp para ultimar la entrega y detalles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
