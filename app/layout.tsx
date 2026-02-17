import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sdmodels.com'),
  title: {
    default: "SDModels - Premium 3D Marketplace for Creators | Buy & Sell 3D Assets",
    template: "%s | SDModels - 3D Marketplace"
  },
  description: "SDModels is the next-generation 3D marketplace for buying and selling premium 3D models, animations, and digital assets. Created by Dawodu David Imole (SD), a 3D artist and animator from Linar Academy. Preview models in real-time with our advanced 3D viewer. Only 7.5% platform fee.",
  keywords: [
    "3D models marketplace",
    "buy 3D assets",
    "sell 3D models",
    "3D animation",
    "game assets",
    "Unity 3D models",
    "Unreal Engine assets",
    "Blender models",
    "3D marketplace",
    "digital assets",
    "3D artist portfolio",
    "Dawodu David Imole",
    "SD 3D artist",
    "Linar Academy",
    "rigged 3D models",
    "PBR textures",
    "low poly models",
    "high poly models",
    "3D character models",
    "3D environment assets",
    "3D weapons",
    "3D vehicles",
    "game ready assets",
    "real-time 3D preview",
    "3D model viewer",
    "affordable 3D assets"
  ],
  authors: [
    { 
      name: "Dawodu David Imole (SD)", 
      url: "https://sdmodels.com/about" 
    }
  ],
  creator: "Dawodu David Imole (SD)",
  publisher: "SDModels",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sdmodels.com",
    siteName: "SDModels",
    title: "SDModels - Premium 3D Marketplace for Creators",
    description: "Buy, sell, and preview premium 3D models in real-time. Created by 3D artist Dawodu David Imole (SD) from Linar Academy. Only 7.5% platform fee.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SDModels - Premium 3D Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SDModels - Premium 3D Marketplace",
    description: "Buy, sell, and preview premium 3D models in real-time. Only 7.5% platform fee.",
    creator: "@sdmodels",
    images: ["/twitter-image.jpg"],
  },
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://sdmodels.com",
  },
  category: "technology",
  classification: "3D Marketplace, Digital Assets, E-commerce",
  other: {
    "author-bio": "Dawodu David Imole (SD) is a 3D artist and animator specializing in 3D modeling, animation, and digital asset creation. Studied at Linar Academy. Creator of SDModels marketplace.",
    "author-skills": "3D Modeling, Animation, Rigging, Texturing, Game Assets, Character Design, Environment Design",
    "author-education": "Linar Academy",
    "platform-fee": "7.5%",
    "supported-formats": "GLB, FBX, OBJ, GLTF, USD",
    "supported-engines": "Unity, Unreal Engine, Blender, Maya, 3ds Max",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SDModels",
              "url": "https://sdmodels.com",
              "description": "Premium 3D marketplace for buying and selling 3D models and digital assets",
              "author": {
                "@type": "Person",
                "name": "Dawodu David Imole",
                "alternateName": "SD",
                "description": "3D Artist and Animator specializing in 3D modeling, animation, and digital asset creation",
                "alumniOf": {
                  "@type": "EducationalOrganization",
                  "name": "Linar Academy"
                },
                "knowsAbout": [
                  "3D Modeling",
                  "3D Animation",
                  "Character Rigging",
                  "Texture Mapping",
                  "Game Asset Creation",
                  "Digital Sculpting"
                ]
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://sdmodels.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SDModels",
              "url": "https://sdmodels.com",
              "logo": "https://sdmodels.com/logo.png",
              "founder": {
                "@type": "Person",
                "name": "Dawodu David Imole",
                "alternateName": "SD"
              },
              "description": "Next-generation 3D marketplace for creators",
              "sameAs": [
                "https://twitter.com/sdmodels",
                "https://instagram.com/sdmodels",
                "https://youtube.com/@sdmodels",
                "https://discord.gg/sdmodels"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} smooth-scroll`}>{children}</body>
    </html>
  );
}
