import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/shop/CartContext';
import { Navbar } from '@/components/shop/Navbar';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { PageTransition } from '@/components/shop/PageTransition';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://j3racks.com'),
  title: {
    default: 'J3RACKS - Premium Grills, Parrillas y Cajas Chinas',
    template: '%s | J3RACKS'
  },
  description: 'Tienda de grills, parrillas de alta ingeniería y cajas chinas de alta calidad. Diseños profesionales en acero inoxidable y fierro pesado con materiales de alta resistencia. Hecho artesanalmente en Perú.',
  keywords: [
    'parrillas', 
    'grills', 
    'J3RACKS', 
    'caja china', 
    'asadores', 
    'acero inoxidable', 
    'Hecho en Perú', 
    'BBQ', 
    'cilindros barbacoa', 
    'ahumadores', 
    'parrillas Lima', 
    'parrillas personalizadas'
  ],
  authors: [{ name: 'J3RACKS' }],
  creator: 'J3RACKS',
  publisher: 'J3RACKS',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'J3RACKS - Premium Grills, Parrillas y Cajas Chinas en Perú',
    description: 'Encuentra las mejores parrillas profesionales construidas con acero de alto espesor y acabados de primera para tus asados familiares. Hecho en Perú, envíos nacionales.',
    url: '/',
    siteName: 'J3RACKS',
    images: [
      {
        url: 'https://picsum.photos/seed/bbq_grill/1200/630',
        width: 1200,
        height: 630,
        alt: 'Parrillas J3RACKS Premium',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'J3RACKS - Premium Grills, Parrillas y Cajas Chinas',
    description: 'Parrillas profesionales robustas construidas en acero pesado para asados profesionales. Envíos nacionales en Perú.',
    images: ['https://picsum.photos/seed/bbq_grill/1200/630'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="antialiased bg-brand-dark text-gray-100 min-h-screen">
        <CartProvider>
          <Navbar />
          <PageTransition>
            {children}
          </PageTransition>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
