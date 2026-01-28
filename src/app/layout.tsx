
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { config, cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": config.fullName,
  "alternateName": ["Atithi", "Atiti", "Athithi", "Athiti", "Otithi", "Atithi Resturant", "Atithi Resturent", "Atithi Family Restuarant", "Atithi Femily Restaurant", "Atithi Restaurant Rampurhat", "Atithi Restaurant NH14"],
  "description": "Best Family Restaurant in Rampurhat, Hattala, and Tarapith area. Located on NH-14 near Gurukulpara. Serving authentic Indian, Bengali & Chinese cuisine. " + config.description,
  "url": siteUrl,
  "telephone": "+91-8250104315",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "National Highway 14, Near Gurukulpara, Tilai, Kutigram, Hattala",
    "addressLocality": "Rampurhat",
    "addressRegion": "West Bengal",
    "postalCode": "731224",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 24.166650,
    "longitude": 87.781280
  },
  "servesCuisine": ["Indian", "Bengali", "Chinese", "Mughlai", "Tandoori"],
  "priceRange": "$$",
  "menu": `${siteUrl}/#menu`,
  "openingHours": "Mo,Tu,We,Th,Fr,Sa,Su 08:00-22:00",
  "acceptsReservations": "True",
  "image": "https://yryoxzexvuhimvezdwle.supabase.co/storage/v1/object/public/asset/HeroSec2.webp",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "150",
    "bestRating": "5",
    "worstRating": "1"
  },
  "sameAs": [
    "https://www.instagram.com/atithi_family_restaurant"
  ],
  "hasMenu": {
    "@type": "Menu",
    "name": "Atithi Restaurant Menu",
    "description": "Authentic Indian cuisine with veg and non-veg options",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Veg Dishes",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Chana Masala",
            "description": "A classic North Indian curry with chickpeas in a spicy, tangy tomato-based sauce.",
            "offers": {
              "@type": "Offer",
              "price": "80",
              "priceCurrency": "INR"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Paneer Butter Masala",
            "description": "Soft paneer cubes simmered in a rich, creamy tomato-based gravy.",
            "offers": {
              "@type": "Offer",
              "price": "150",
              "priceCurrency": "INR"
            }
          }
        ]
      },
      {
        "@type": "MenuSection",
        "name": "Non-Veg Dishes",
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Chicken Curry",
            "description": "Tender chicken pieces cooked in a flavorful blend of spices.",
            "offers": {
              "@type": "Offer",
              "price": "180",
              "priceCurrency": "INR"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Mutton Bhuna",
            "description": "Slow-cooked mutton with aromatic spices in a thick, rich gravy.",
            "offers": {
              "@type": "Offer",
              "price": "280",
              "priceCurrency": "INR"
            }
          }
        ]
      }
    ]
  }
};

// WebSite schema for sitelinks search box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": config.fullName,
  "alternateName": ["Atithi", "Atithi Restaurant"],
  "url": siteUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${siteUrl}/#menu?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

// BreadcrumbList schema
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Menu",
      "item": `${siteUrl}/#menu`
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "About",
      "item": `${siteUrl}/about`
    }
  ]
};


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${config.fullName} - ${config.industry}`,
    template: `%s | ${config.brandName}`,
  },
  description: config.description,
  keywords: [
    "indian restaurant", "family restaurant", "highway restaurant", "rampurhat", "birbhum", "tarapith",
    "hygienic food", "premium dining", "atithi", "atiti", "athithi", "athiti",
    "best restaurant rampurhat", "restaurant near me", "food delivery rampurhat",
    "biryani rampurhat", "chicken biryani", "butter chicken", "paneer dishes",
    "chinese food rampurhat", "tandoori", "north indian food", "bengali food",
    "family dining", "veg restaurant", "non veg restaurant", "best food NH14",
    "restaurant in hattala", "restaurant near gurukulpara", "restaurant in tilai", "hotel in kutigram",
    "rampurhat railway station food", "tarapith nearby restaurant", "restaurant in nalhati",
    "mallarpur restaurant", "sainthia food", "best family restaurant birbhum",
    "restuarant", "restaurent", "femily restaurant", "dhaba near me", "food hotel",
    "otiti", "athithi", "famly restaurant", "resturant rampurhat", "resturent near me"
  ],
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
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-96x96.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#a97736',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable)}>
      <head>
        {/* DNS Prefetch for faster external resource loading */}
        <link rel="dns-prefetch" href="https://yryoxzexvuhimvezdwle.supabase.co" />
        <link rel="dns-prefetch" href="https://ihpfajyotvzcdqagdslw.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preconnect for critical resources */}
        <link rel="preconnect" href="https://yryoxzexvuhimvezdwle.supabase.co" />
        <link rel="preconnect" href="https://ihpfajyotvzcdqagdslw.supabase.co" />
        {/* Preload hero image for faster LCP */}
        <link
          rel="preload"
          href="https://yryoxzexvuhimvezdwle.supabase.co/storage/v1/object/public/asset/HeroSec2.webp"
          as="image"
          type="image/webp"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        {children}
        <Toaster />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EP02M0S335"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-EP02M0S335');
          `}
        </Script>
      </body>
    </html>
  );
}
