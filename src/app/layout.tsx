
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { config, cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.atithirestaurant.in';

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
  "description": config.description,
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
  "image": "https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/food_images/bestseller-butter-chicken.webp",
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
    default: "Atithi Family Restaurant | Premium Dining in Rampurhat",
    template: "%s | Atithi - Rampurhat",
  },
  description:
    "Experience the finest multi-cuisine dining at Atithi Family Restaurant in Rampurhat. Serving authentic Indian, Bengali & Chinese delicacies in a premium, hygienic, and air-conditioned ambiance. Located conveniently on NH-14, near Tarapith & Hattala. The perfect stop for families and highway travelers seeking quality food and comfort.",
  keywords: [
    // Core Identity
    "Atithi Family Restaurant", "Best Restaurant in Rampurhat", "Top Rated Restaurant Rampurhat",
    "Premium Family Dining Rampurhat", "AC Restaurant Rampurhat", "Fine Dining Birbhum",

    // Location Based
    "Restaurant near Tarapith Temple", "Food near Tarapith", "Restaurant near Hattala",
    "Highway Restaurant NH14", "Best Hotel on NH14", "Restaurant in Rampurhat Railway Station area",
    "Dining in Birbhum", "Places to eat in Rampurhat",

    // Cuisine & Food
    "Authentic Bengali Thali Rampurhat", "Best Biryani in Rampurhat", "North Indian Food Rampurhat",
    "Chinese Restaurant Rampurhat", "Butter Chicken Rampurhat", "Mutton Kasa", "Veg Thali",
    "Tandoori Chicken", "Fresh Seafood", "Vegetarian Restaurant options",

    // Qualities
    "Hygienic Food Rampurhat", "Clean Washrooms Highway", "Family Friendly Restaurant",
    "Good Parking Space", "Breakfast Lunch Dinner", "Late night food Rampurhat",

    // Common Misspellings & Variations (Crucial for Local Search)
    "Atiti", "Athithi", "Otithi", "Othithi", "Atithi Hotel", "Attithi", "Athisi",
    "Resturant", "Restaurent", "Resturent", "Rasturant", "Femily Restaurant",
    "Dhaba near me", "Food Hotel Rampurhat", "Khawar Hotel Rampurhat",

    // Spanglish / Bangla-English Search Terms
    "Rampurhat e bhalo khawar hotel", "Tarapith er kache restaurant",
    "NH14 dhaba", "Atithi Menu", "Atithi Phone Number",
    "Best restaurant for lunch", "Best place for dinner"
  ],
  authors: [{ name: 'Atithi Family Restaurant', url: siteUrl }],
  creator: 'Atithi Family Restaurant',
  publisher: 'Atithi Family Restaurant',
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
    title: "Atithi Family Restaurant | Exquisite Dining in Rampurhat",
    description: "Discover the taste of authentic Indian cuisine. A perfect blend of tradition, taste, and hospitality on NH-14, Rampurhat.",
    url: siteUrl,
    siteName: "Atithi Family Restaurant",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Atithi Family Restaurant - Premium Dining',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Atithi - Best Family Restaurant in Rampurhat | NH-14`,
    description: config.description,
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },

  // Favicon configuration for Google SERP compliance
  icons: {
    // Using PNG icons as primary since favicon.ico is not deploying correctly
    icon: [
      { url: '/icons/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-48x48.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        {/* Preconnect and DNS Prefetch for faster external resource loading */}
        <link rel="preconnect" href="https://ihpfajyotvzcdqagdslw.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ihpfajyotvzcdqagdslw.supabase.co" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Preload LCP image for mobile */}
        <link
          rel="preload"
          as="image"
          href="https://ihpfajyotvzcdqagdslw.supabase.co/storage/v1/object/public/Banner/banner-one.webp"
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
