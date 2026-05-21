import { SupabaseClient } from '@supabase/supabase-js';
import { 
  ProductRepository, 
  CategoryRepository, 
  ProfileRepository, 
  OrderRepository, 
  SettingsRepository 
} from '@/domain/repositories';
import { Product, Category, Profile, Order } from '@/domain/entities';

export class SupabaseProductRepository implements ProductRepository {
  constructor(private supabase: SupabaseClient) {}

  private mapProduct(p: any): Product {
    const images = (p.product_images || []).map((img: any) => ({
      id: img.id,
      product_id: img.product_id,
      url: img.url,
      label: img.label || null,
      position: img.position ?? 0,
      created_at: img.created_at,
    })).sort((a: any, b: any) => a.position - b.position);

    return {
      id: p.id,
      name: p.name,
      description: p.description || null,
      price: Number(p.price),
      is_visible: p.is_visible ?? true,
      category_id: p.category_id || null,
      category: p.categories ? {
        id: p.categories.id,
        name: p.categories.name,
        slug: p.categories.slug,
        created_at: p.categories.created_at,
      } : null,
      images,
      created_at: p.created_at,
      updated_at: p.updated_at,
    };
  }

  async getProducts(filters?: { onlyVisible?: boolean; categoryId?: string; search?: string }): Promise<Product[]> {
    let query = this.supabase
      .from('products')
      .select('*, product_images(*), categories(*)');

    if (filters?.onlyVisible) {
      query = query.eq('is_visible', true);
    }
    if (filters?.categoryId && filters.categoryId !== 'all') {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    return (data || []).map(p => this.mapProduct(p));
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, product_images(*), categories(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return this.mapProduct(data);
  }

  async createProduct(
    product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, 
    images: { url: string; label: string | null; position: number }[]
  ): Promise<Product> {
    const { data: prodData, error: prodError } = await this.supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        is_visible: product.is_visible,
        category_id: product.category_id,
      })
      .select()
      .single();

    if (prodError) throw prodError;

    if (images && images.length > 0) {
      const imagesToInsert = images.map(img => ({
        product_id: prodData.id,
        url: img.url,
        label: img.label,
        position: img.position,
      }));
      const { error: imgError } = await this.supabase
        .from('product_images')
        .insert(imagesToInsert);
      if (imgError) throw imgError;
    }

    const fresh = await this.getProductById(prodData.id);
    if (!fresh) throw new Error('Failed to retrieve newly created product');
    return fresh;
  }

  async updateProduct(
    id: string, 
    product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>, 
    images: { id?: string; url: string; label: string | null; position: number }[]
  ): Promise<void> {
    const { error: prodError } = await this.supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        is_visible: product.is_visible,
        category_id: product.category_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (prodError) throw prodError;

    if (images) {
      // Clear previous attachments inside transactions or simply delete and re-insert
      const { error: delError } = await this.supabase
        .from('product_images')
        .delete()
        .eq('product_id', id);
      if (delError) throw delError;

      if (images.length > 0) {
        const imagesToInsert = images.map(img => ({
          product_id: id,
          url: img.url,
          label: img.label,
          position: img.position,
        }));
        const { error: imgError } = await this.supabase
          .from('product_images')
          .insert(imagesToInsert);
        if (imgError) throw imgError;
      }
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async toggleVisibility(id: string, isVisible: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .update({ is_visible: isVisible, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private supabase: SupabaseClient) {}

  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async createCategory(name: string, slug: string): Promise<Category> {
    const { data, error } = await this.supabase
      .from('categories')
      .insert({ name, slug })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}

export class SupabaseProfileRepository implements ProfileRepository {
  constructor(private supabase: SupabaseClient) {}

  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  }

  async updateProfile(id: string, profile: Partial<Omit<Profile, 'id' | 'created_at' | 'role'>>): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .update(profile)
      .eq('id', id);
    if (error) throw error;
  }

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async setProfileRole(id: string, role: 'customer' | 'admin'): Promise<void> {
    const { error } = await this.supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);
    if (error) throw error;
  }
}

export class SupabaseOrderRepository implements OrderRepository {
  constructor(private supabase: SupabaseClient) {}

  async createOrder(order: { user_id: string | null; items: any[]; total: number }): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert({
        user_id: order.user_id,
        items: order.items,
        total: order.total,
        whatsapp_sent_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((o: any) => ({
      id: o.id,
      user_id: o.user_id,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
      total: Number(o.total),
      whatsapp_sent_at: o.whatsapp_sent_at,
      created_at: o.created_at,
    }));
  }
}

export class SupabaseSettingsRepository implements SettingsRepository {
  constructor(private supabase: SupabaseClient) {}

  async getSettings(): Promise<Record<string, string>> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('*');

    const settings: Record<string, string> = {
      whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51997444846',
      store_name: process.env.NEXT_PUBLIC_STORE_NAME || 'J3RACKS',
      tiktok_url: process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@j3.racks',
    };

    if (!error && data) {
      data.forEach((s: any) => {
        settings[s.key] = s.value;
      });
    }
    return settings;
  }

  async updateSetting(key: string, value: string): Promise<void> {
    const { error } = await this.supabase
      .from('settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key'
      });
    if (error) throw error;
  }
}
