import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { config } from './config';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": config.fullName,
  "description": config.description,
  "url": siteUrl,
  "telephone": "+91-8250104315",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "NH 34, Gazole",
    "addressLocality": "Malda",
    "addressRegion": "West Bengal",
    "postalCode": "732124",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 24.2024486,
    "longitude": 87.7985075
  },
  "servesCuisine": "Indian",
  "priceRange": "$$",
  "menu": `${siteUrl}/#menu`,
  "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 08:00-22:00",
  "acceptsReservations": "True"
};


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${config.fullName} - ${config.industry}`,
    template: `%s | ${config.brandName}`,
  },
  description: config.description,
  keywords: ["indian restaurant", "family restaurant", "highway restaurant", "gazole", "malda", "hygienic food", "premium dining", "atithi"],
  authors: [{ name: 'Atithi Family Restaurant', url: siteUrl }],
  creator: 'Firebase Studio',
  publisher: 'Firebase Studio',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${config.fullName} - Premium Highway Dining`,
    description: config.description,
    url: siteUrl,
    siteName: config.fullName,
    images: [
      {
        url: 'https://yryoxzexvuhimvezdwle.supabase.co/storage/v1/object/public/asset/HeroSec2.webp',
        width: 1200,
        height: 630,
        alt: 'A serene and luxurious dining space at Atithi Family Restaurant.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.fullName} - Premium Highway Dining`,
    description: config.description,
    images: ['https://yryoxzexvuhimvezdwle.supabase.co/storage/v1/object/public/asset/HeroSec2.webp'],
  },
  alternates: {
    canonical: siteUrl,
  },
  sitemap: `${siteUrl}/sitemap.xml`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
