import { MetadataRoute } from 'next';
import { createClient } from '../infrastructure/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Production URL fallback
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://j3racks.com';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  try {
    const supabase = createClient();
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('is_visible', true);

    if (products && products.length > 0) {
      const productRoutes = products.map((prod) => ({
        url: `${baseUrl}/products/${prod.id}`,
        lastModified: prod.updated_at ? new Date(prod.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
      return [...routes, ...productRoutes];
    }
  } catch (error) {
    console.error('Error generating sitemap dynamically:', error);
  }

  return routes;
}
