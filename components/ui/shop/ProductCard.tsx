'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/domain/entities';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCart } from './CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const mainImage = product.images && product.images.length > 0 
    ? product.images.find(img => img.position === 0) || product.images[0]
    : null;

  return (
    <Card hoverEffect className="flex flex-col h-full bg-brand-coal border-brand-ash/60">
      {/* Product Image section */}
      <Link href={`/products/${product.id}`} className="relative block aspect-square w-full bg-black/40 overflow-hidden group/img">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover/img:scale-110"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-brand-ash/30 p-4">
            <span className="text-sm font-medium text-center">Sin imagen de parrilla</span>
          </div>
        )}
        
        {/* Hover Eye banner */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <span className="bg-brand-dark/95 border border-brand-ash text-white text-xs py-2 px-3.5 rounded flex items-center gap-1.5 font-semibold">
            <Eye className="w-4 h-4 text-brand-fire" />
            Detalles
          </span>
        </div>
      </Link>

      {/* Content wrapper */}
      <CardContent className="flex flex-col flex-grow p-4 md:p-5">
        {product.category && (
          <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-brand-fire mb-1.5">
            {product.category.name}
          </span>
        )}
        
        {/* Title */}
        <Link href={`/products/${product.id}`} className="hover:text-brand-fire transition-colors mb-2">
          <h3 className="text-xl font-bold uppercase tracking-wide line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Description Snippet */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-4 h-8">
          {product.description || 'Parrilla premium J3RACKS fabricada con materiales de alta resistencia y acabados profesionales.'}
        </p>

        {/* Price and Add button */}
        <div className="mt-auto pt-3 border-t border-brand-ash/40 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 capitalize">Precio</span>
            <span className="text-lg font-extrabold text-white">
              S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <Button 
            size="sm" 
            variant="primary" 
            className="h-10 px-3 min-w-10 flex items-center gap-1.5"
            onClick={() => addToCart(product, 1)}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Comprar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
