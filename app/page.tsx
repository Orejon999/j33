'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Phone, Flame, Shield, Award, Sparkles, MessageSquare, AlertTriangle, Database } from 'lucide-react';
import { Product, Category } from '@/domain/entities';
import { ProductCard } from '@/components/shop/ProductCard';
import { Button } from '@/components/ui/Button';
import { J3Logo } from '@/components/ui/J3Logo';
import CtaPage from '@/components/ui/animated-background-lines';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Fetch initial category options
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        } else {
          try {
            const errData = await res.json();
            if (errData && errData.error) {
              setDbError(errData.error);
            }
          } catch (_) {}
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products automatically when filter parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('onlyVisible', 'true');
        if (selectedCategory && selectedCategory !== 'all') {
          queryParams.append('category_id', selectedCategory);
        }
        if (search) {
          queryParams.append('search', search);
        }

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setDbError(null); // Clear error if fetch succeeded
        } else {
          try {
            const errData = await res.json();
            if (errData && errData.error) {
              setDbError(errData.error);
            }
          } catch (_) {}
        }
      } catch (err: any) {
        console.error('Error loading products list:', err);
      } finally {
        setIsLoading(false);
      }
    };

    // Minor debounce delay for search term
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory]);

  return (
    <main className="min-h-screen bg-brand-dark pb-16">
      {/* 1. Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image overlay with charcoal gradients */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/30 z-10" />
          <div className="absolute inset-0 bg-radial-at-c from-brand-fire/20 to-transparent mix-blend-color-dodge opacity-60 z-10" />
          <img
            src="https://picsum.photos/seed/bbq_grill/1920/1080"
            alt="Parrilla J3RACKS cocinando carne"
            className="w-full h-full object-cover filter brightness-[0.35]"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-3 text-center space-y-6">
          <div className="flex flex-col items-center justify-center pt-2">
            <J3Logo className="w-44 sm:w-56 md:w-64 lg:w-72 h-auto filter drop-shadow-[0_0_15px_rgba(250,177,21,0.25)] animate-fade-in" showText={true} />
          </div>

          <span className="inline-flex items-center gap-1.5 uppercase font-extrabold tracking-widest text-brand-fire bg-brand-fire/10 text-xs py-1.5 px-3 rounded border border-brand-fire/20">
            <Flame className="w-4 h-4 animate-pulse text-brand-fire" />
            Hecho en el Perú - Calidad Industrial
          </span>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white leading-none">
            J3<span className="text-brand-fire">RACKS</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-sans font-medium tracking-wide">
            Garantía de sabor nacional. Grills, parrillas de alta ingeniería, ahumadores y cilindros de fierro pesado listos para la brasa de tus fines de semana.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="#catalog">
              <Button size="lg" variant="primary">
                Ver Grills y Productos
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="secondary">
                Contacto Directo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Value Pillars (Anti AI-Slop, Clean Craftsmanship) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-brand-coal border border-brand-ash/60 rounded flex gap-4 items-start">
            <Shield className="w-8 h-8 text-brand-fire shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-bold uppercase text-white mb-1 tracking-wide">Materiales de primera</h4>
              <p className="text-xs text-gray-400 font-medium">Acero de alto espesor y acero inoxidable AISI 304 resistentes a climas marinos extremas.</p>
            </div>
          </div>
          <div className="p-6 bg-brand-coal border border-brand-ash/60 rounded flex gap-4 items-start">
            <Award className="w-8 h-8 text-brand-fire shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-bold uppercase text-white mb-1 tracking-wide">Hecho a la medida</h4>
              <p className="text-xs text-gray-400 font-medium">Fabricación robusta artesanal con acabados limpios y sistemas de elevación regulables.</p>
            </div>
          </div>
          <div className="p-6 bg-brand-coal border border-brand-ash/60 rounded flex gap-4 items-start">
            <Sparkles className="w-8 h-8 text-brand-fire shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-bold uppercase text-white mb-1 tracking-wide">Sabor inigualable</h4>
              <p className="text-xs text-gray-400 font-medium">Sistemas de flujos de calor optimizados para el asado perfecto a leña, o carbón.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Catalog Shell */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
        <div className="border-b border-brand-ash/60 pb-5 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold uppercase text-white tracking-wide">
              Catálogo de <span className="text-brand-fire">Brasas</span>
            </h2>
            <p className="text-sm text-gray-400 font-sans mt-1">
              Filtra nuestros modelos en stock y encarga tu parrilla favorita.
            </p>
          </div>

          {/* Search Term Bar (Extra 2) */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por parrilla, grill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-coal border border-brand-ash text-white placeholder-gray-500 rounded px-10 py-2.5 text-sm focus:outline-none focus:border-brand-fire transition-colors"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
          </div>
        </div>

        {dbError && (
          <div className="mb-10 p-6 bg-brand-coal border border-amber-500/30 rounded flex flex-col md:flex-row items-start gap-4 text-left shadow-lg">
            <div className="p-3 rounded bg-amber-500/10 text-amber-500 shrink-0">
              <Database className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-base font-bold text-amber-500 uppercase tracking-widest leading-none">⚠️ Inicialización de Base de Datos Requerida</h3>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                El diseño y la aplicación J3RACKS están listos, pero la base de datos de Supabase asociada está vacía o no tiene el esquema creado.
              </p>
              <div className="p-3 bg-brand-dark/85 border border-brand-ash/60 rounded text-xs space-y-1">
                <span className="text-gray-400 block font-semibold">Detalle del error reportado por Supabase:</span>
                <code className="text-amber-400 font-mono break-all">{dbError}</code>
              </div>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                <strong>¿Cómo solucionarlo?:</strong> Abre el panel de control de tu proyecto <code className="text-gray-200">hmkgrlncokcmpejkhopd</code> en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline text-amber-500 hover:text-amber-400 font-bold">Supabase Dashboard</a>, dirígete al <strong>SQL Editor</strong>, copia el contenido completo del archivo <code className="text-gray-200">supabase_schema.sql</code> (que encuentras en la raíz del código de tu app), pégalo en el editor de Supabase y presiona <strong>Run</strong>. Al completarse, vuelve a recargar esta página.
              </p>
            </div>
          </div>
        )}

        {/* Categories Toolbar (Extra 1) */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-brand-fire text-white border-brand-fire'
                  : 'bg-brand-coal text-gray-400 border-brand-ash hover:text-white hover:border-gray-500'
              }`}
            >
              Todos los modelos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-brand-fire text-white border-brand-fire'
                    : 'bg-brand-coal text-gray-400 border-brand-ash hover:text-white hover:border-gray-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Dynamic Product Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand-fire border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-400 capitalize">Cargando modelos J3RACKS...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-brand-coal/30 border border-brand-ash/40 rounded">
            <p className="text-lg font-bold text-gray-300">No se encontraron productos</p>
            <p className="text-sm text-gray-500 mt-1">Prueba cambiando los filtros de categoría o buscando otro término.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Location and Contact section (Extra 4) */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="p-8 md:p-12 bg-brand-coal rounded border border-brand-ash/60 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-fire">
              ¿Listo para armar las brasas?
            </span>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-wide text-white leading-tight">
              Pide tu parrilla personalizada
            </h3>
            <p className="text-sm text-gray-300 font-sans leading-relaxed">
              Atendemos pedidos a todo el Perú con despachos garantizados y ensambles de primer nivel. Háblanos para cotizaciones de medidas especiales, cajones térmicos, o campanas extractoras.
            </p>

            <div className="space-y-4 pt-2">
              <a 
                href="https://wa.me/51997444846" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-brand-fire transition-colors"
              >
                <div className="w-10 h-10 rounded bg-brand-dark/60 border border-brand-ash/60 flex items-center justify-center text-brand-fire shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">WhatsApp Delivery</span>
                  <span className="text-sm font-semibold tracking-wide">+51 997 444 846</span>
                </div>
              </a>

              <a 
                href="https://www.tiktok.com/@j3.racks" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 text-gray-200 hover:text-brand-fire transition-colors"
              >
                <div className="w-10 h-10 rounded bg-brand-dark/60 border border-brand-ash/60 flex items-center justify-center text-brand-fire shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">TikTok Videos</span>
                  <span className="text-sm font-semibold tracking-wide">@j3.racks</span>
                </div>
              </a>

              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-10 h-10 rounded bg-brand-dark/60 border border-brand-ash/60 flex items-center justify-center text-brand-fire shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">Locación y Cobertura</span>
                  <span className="text-sm font-semibold tracking-wide">Lima - Despachos a nivel nacional</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact design showcase image / representation */}
          <div className="relative aspect-[4/3] rounded overflow-hidden border border-brand-ash/60">
            <div className="absolute inset-0 bg-brand-fire/10 mix-blend-color z-10" />
            <img 
              src="https://picsum.photos/seed/j3racks_work/800/600" 
              alt="Planta metalúrgica taller de J3RACKS parrillas" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </section>

      {/* Decorative Warm Artisan CTA Section */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <CtaPage />
      </div>

      {/* 5. Humble Human footer */}
      <footer className="max-w-7xl mx-auto px-4 text-center mt-20 pt-8 border-t border-brand-ash/40 text-gray-500 text-xs">
        <p className="uppercase tracking-widest font-bold text-[10px]">
          © {new Date().getFullYear()} J3RACKS. Todos los derechos reservados.
        </p>
        <p className="mt-1">Fabricación artesanal robusta - Lima, Perú.</p>
      </footer>
    </main>
  );
}
