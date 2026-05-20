'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Flame, Plus, Loader2, Eye, EyeOff, Edit, Trash2, 
  ShoppingBag, Check, ShieldAlert, ChevronRight, Activity, DollarSign, Archive 
} from 'lucide-react';
import { createClient } from '@/infrastructure/supabase/client';
import { Product, Order, Profile } from '@/domain/entities';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  // 1. Authenticate user role
  useEffect(() => {
    const authAdmin = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
        return;
      }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!prof || prof.role !== 'admin') {
        // Redirigir si no es admin
        router.push('/login');
        return;
      }

      setProfile(prof);
      setIsLoading(false);
    };

    authAdmin();
  }, [router]);

  // 2. Fetch products and orders data
  const fetchData = async () => {
    setItemsLoading(true);
    try {
      // Products list (unfiltered/unhidden for Admin)
      const prodRes = await fetch('/api/products?onlyVisible=false');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }

      // Orders list
      const orderRes = await fetch('/api/orders');
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrders(orderData);
      }
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [isLoading]);

  // 3. Toggle product visibility in real time
  const handleToggleVisibility = async (productId: string, currentVal: boolean) => {
    setIsToggling(productId);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentVal }),
      });

      if (response.ok) {
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, is_visible: !currentVal } : p));
      } else {
        alert('Could not toggle visibility status.');
      }
    } catch (err) {
      console.error('Error toggling is_visible flag:', err);
    } finally {
      setIsToggling(null);
    }
  };

  // 4. Delete product
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro que deseas eliminar permanentemente la parrilla "${productName}" y todas sus fotos?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        const err = await response.json();
        alert(`Error al eliminar: ${err.error || 'Intente de nuevo.'}`);
      }
    } catch (err) {
      console.error('Error delete product route call:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-brand-fire animate-spin mb-3" />
        <p className="text-sm text-gray-400 capitalize">Autenticando credenciales de administrador...</p>
      </div>
    );
  }

  // Summary statistics
  const totalProducts = products.length;
  const visibleProducts = products.filter(p => p.is_visible).length;
  const hiddenProducts = totalProducts - visibleProducts;
  const totalEarnings = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="min-h-screen bg-brand-dark py-12 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner admin dashboard */}
        <div className="border-b border-brand-ash pb-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-brand-fire" />
              Consola de Administración
            </h1>
            <p className="text-xs text-gray-400">
              Bienvenido, {profile?.first_name} {profile?.last_name}. Aquí puedes gestionar todo el inventario de J3RACKS.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/admin/products/new">
              <Button variant="primary" className="flex items-center gap-1.5 text-xs font-bold uppercase">
                <Plus className="w-4 h-4" />
                Nueva Parrilla
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" className="text-xs font-bold uppercase">
                Ver Catalogo Público
              </Button>
            </Link>
          </div>
        </div>

        {/* Dynamic Statistics dashboard grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <Card className="bg-brand-coal/80 border-brand-ash flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded bg-brand-fire/15 border border-brand-fire/35 flex items-center justify-center text-brand-fire shrink-0">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Total Parrillas</span>
              <span className="text-2xl font-extrabold">{itemsLoading ? '...' : totalProducts}</span>
            </div>
          </Card>

          <Card className="bg-brand-coal/80 border-brand-ash flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded bg-green-500/15 border border-green-500/35 flex items-center justify-center text-green-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Modelos Visibles</span>
              <span className="text-2xl font-extrabold text-green-400">{itemsLoading ? '...' : visibleProducts}</span>
            </div>
          </Card>

          <Card className="bg-brand-coal/80 border-brand-ash flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded bg-yellow-500/15 border border-yellow-500/35 flex items-center justify-center text-yellow-400 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Modelos Ocultos</span>
              <span className="text-2xl font-extrabold text-yellow-400">{itemsLoading ? '...' : hiddenProducts}</span>
            </div>
          </Card>

          <Card className="bg-brand-coal/80 border-brand-ash flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded bg-brand-fire/15 border border-brand-fire/35 flex items-center justify-center text-brand-fire shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-500">Pedidos Registrados</span>
              <span className="text-2xl font-extrabold">{itemsLoading ? '...' : orders.length}</span>
            </div>
          </Card>

        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-brand-ash mb-8 gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'products'
                ? 'border-brand-fire text-brand-fire font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Parrillas y Productos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs uppercase tracking-widest font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'border-brand-fire text-brand-fire font-bold'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Historial de WhatsApp ({orders.length})
          </button>
        </div>

        {/* Render Tab Contents */}
        {itemsLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="w-10 h-10 text-brand-fire animate-spin mb-3" />
            <p className="text-sm text-gray-400">Cargando base de datos J3RACKS...</p>
          </div>
        ) : activeTab === 'products' ? (
          /* Products Tab */
          <Card className="bg-brand-coal border-brand-ash overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-dark/50 border-b border-brand-ash text-[10px] uppercase tracking-wider text-gray-400 font-extrabold">
                    <th className="p-4 pl-6">Foto</th>
                    <th className="p-4">Nombre / Código</th>
                    <th className="p-4">Precio (S/)</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Visibilidad</th>
                    <th className="p-4 text-right pr-6">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-ash/60">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-500 text-sm">
                        No hay ninguna parrilla configurada en la base de datos yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => {
                      const mainImg = p.images && p.images.length > 0 ? p.images[0].url : null;
                      return (
                        <tr key={p.id} className="hover:bg-brand-dark/20 transition-colors">
                          <td className="p-4 pl-6 shrink-0">
                            <div className="w-12 h-12 bg-black border border-brand-ash rounded overflow-hidden relative">
                              {mainImg ? (
                                <img src={mainImg} alt={p.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 font-bold">J3R</div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <h4 className="text-sm font-bold uppercase tracking-wide text-gray-100">{p.name}</h4>
                            <span className="text-[10px] font-mono text-gray-500 block mt-0.5">{p.id}</span>
                          </td>
                          <td className="p-4 font-bold text-brand-fire">
                            S/ {p.price.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 text-xs font-semibold text-gray-300">
                            {p.category?.name || 'General / Sin Categoría'}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleVisibility(p.id, p.is_visible)}
                              disabled={isToggling === p.id}
                              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
                                p.is_visible
                                  ? 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25'
                                  : 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/25'
                              }`}
                            >
                              {isToggling === p.id ? 'Cambiando...' : p.is_visible ? 'VISIBLE' : 'OCULTO'}
                            </button>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              <Link href={`/admin/products/${p.id}/edit`}>
                                <button className="p-2 bg-brand-dark hover:bg-brand-ash border border-brand-ash rounded text-gray-300 hover:text-white cursor-pointer transition-colors" title="Editar">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </Link>
                              
                              <button 
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 bg-brand-dark hover:bg-brand-ember/15 border border-brand-ash hover:border-brand-ember/30 rounded text-gray-400 hover:text-brand-ember cursor-pointer transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Orders history Tab */
          <Card className="bg-brand-coal border-brand-ash overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-dark/50 border-b border-brand-ash text-[10px] uppercase tracking-wider text-gray-400 font-extrabold font-sans">
                    <th className="p-4 pl-6">ID de Registro</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4">Artículos Solicitados</th>
                    <th className="p-4">Importe Total (S/)</th>
                    <th className="p-4">Cliente de Enlace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-ash/60">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500 text-sm">
                        Aún no se ha completado ningún pedido a WhatsApp por los clientes.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-brand-dark/20 transition-colors">
                        <td className="p-4 pl-6 font-mono text-xs text-gray-400">
                          {o.id.slice(0, 8)}
                        </td>
                        <td className="p-4 text-xs font-medium text-gray-300">
                          {new Date(o.created_at).toLocaleString('es-PE')}
                        </td>
                        <td className="p-4 py-3 shrink-0">
                          <div className="space-y-1">
                            {o.items?.map((item: any, idx: number) => (
                              <span key={idx} className="block text-xs font-semibold text-gray-200">
                                {item.quantity}x {item.name || 'Parrilla'}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-brand-fire">
                          S/ {o.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 text-xs font-semibold text-gray-400">
                          {o.user_id ? 'Usuario Registrado' : 'Cliente Invitado'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </div>
    </main>
  );
}
