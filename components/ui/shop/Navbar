'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, ShieldAlert, LogOut } from 'lucide-react';
import { useCart } from './CartContext';
import { createClient } from '@/infrastructure/supabase/client';
import { Profile } from '@/domain/entities';
import { J3Logo } from '../ui/J3Logo';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { getItemCount, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Initial fetch user
    const checkUser = async () => {
      const { data: { user: usr } } = await supabase.auth.getUser();
      setUser(usr);
      if (usr) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', usr.id)
          .single();
        if (prof) {
          setProfile(prof);
        }
      } else {
        setProfile(null);
      }
    };
    checkUser();

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const usr = session?.user || null;
      setUser(usr);
      if (usr) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', usr.id)
          .single();
        if (prof) setProfile(prof);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Catálogo', path: '/#catalog' },
    { name: 'Contacto', path: '/#contact' },
  ];

  return (
    <nav className="bg-brand-dark/95 border-b border-brand-ash/60 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <J3Logo className="h-8 w-auto shrink-0" showText={false} />
              <span className="text-2xl font-extrabold uppercase tracking-widest text-white brand-font flex items-center">
                J3<span className="text-brand-fire">RACKS</span>
              </span>
              <span className="hidden sm:inline border-l border-brand-ash pl-2.5 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                Premium Grills
              </span>
            </Link>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm uppercase tracking-wider font-semibold hover:text-brand-fire transition-colors ${
                  pathname === link.path ? 'text-brand-fire' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Admin trigger if role is admin */}
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-white hover:text-brand-fire-hover text-xs font-bold uppercase tracking-widest bg-brand-fire/20 border border-brand-fire/50 rounded px-2.5 py-1 flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-brand-fire" />
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop user profile controls & cart */}
          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/account"
                  className="text-xs text-gray-300 hover:text-brand-fire flex items-center gap-1.5 font-semibold bg-brand-coal hover:bg-brand-ash px-3 py-1.5 rounded border border-brand-ash/50 transition-colors"
                >
                  <User className="w-4 h-4 text-brand-fire" />
                  {profile.first_name}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-gray-400 hover:text-brand-ember hover:bg-brand-ash/10 rounded cursor-pointer transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-semibold text-gray-300 hover:text-brand-fire uppercase tracking-wider flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-brand-fire" />
                Ingresar
              </Link>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-brand-fire bg-brand-coal duration-200 cursor-pointer rounded border border-brand-ash/50 hover:border-brand-fire/40 transition-colors"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-fire text-white text-[10px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center border-2 border-brand-dark animate-pulse">
                  {getItemCount()}
                </span>
              )}
            </button>
          </div>

          {/* Mobile elements layout (cart + menu button) */}
          <div className="md:hidden flex items-center gap-3">
            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-brand-fire bg-brand-coal rounded border border-brand-ash/50 cursor-pointer"
              aria-label="Ver carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-fire text-white text-[10px] font-extrabold rounded-full h-5 w-5 flex items-center justify-center border-2 border-brand-dark">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Hamburger button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded text-gray-400 hover:text-white hover:bg-brand-ash/60 focus:outline-none cursor-pointer"
              aria-label="Menú principal"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-coal border-b border-brand-ash/60 px-2 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded text-base font-bold uppercase tracking-wide text-gray-200 hover:text-brand-fire hover:bg-brand-dark"
            >
              {link.name}
            </Link>
          ))}

          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded text-base font-bold uppercase tracking-wide text-brand-fire bg-brand-fire/10 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              PANEL ADMIN
            </Link>
          )}

          <div className="border-t border-brand-ash/50 my-2 pt-2">
            {profile ? (
              <div className="px-3 space-y-2">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-semibold text-gray-200 py-2 hover:text-brand-fire flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-brand-fire" />
                  Mi Cuenta ({profile.first_name})
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="w-full text-left font-semibold text-brand-ember text-sm py-2 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-bold uppercase tracking-wide text-gray-200 hover:text-brand-fire flex items-center gap-2"
              >
                <User className="w-4 h-4 text-brand-fire" />
                INGRESAR A MI CUENTA
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
