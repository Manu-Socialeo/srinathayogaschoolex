import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'YogaSchool',
  name: 'Srinatha Yoga School',
  description: 'Traditional Mysore Yoga, taught online for the modern world. Certified TTC, Philosophy, and Ayurveda courses.',
  url: 'https://srinathayogaschool.com',
  logo: 'https://srinathayogaschool.com/images/logo.png',
  image: 'https://srinathayogaschool.com/images/logo.png',
  telephone: '+919886512083',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mysore',
    addressRegion: 'Karnataka',
    addressCountry: 'IN',
  },
  areaServed: 'Worldwide',
  sameAs: [
    'https://www.instagram.com/yogawithsrinatha/',
    'https://www.facebook.com/yogawithsrinath/',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2000',
  },
}

export const metadata: Metadata = {
  title: {
    default: 'Srinatha Yoga School | Online Ashtanga & Hatha Yoga Teacher Training Mysore',
    template: '%s | Srinatha Yoga School',
  },
  description: 'Experience traditional Mysore yoga online. Certified TTC, Philosophy, and Ayurveda courses led by Dr. Srinatha. Yoga Alliance & YACP accredited.',
  keywords: ['yoga', 'ashtanga', 'hatha', 'teacher training', 'mysore', 'online yoga', 'yoga alliance', 'YACP', 'Dr. Srinatha', 'ayurveda', 'philosophy'],
  authors: [{ name: 'Dr. Balasundara Srinatha' }],
  metadataBase: new URL('https://srinathayogaschool.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    siteName: 'Srinatha Yoga School',
    title: 'Srinatha Yoga School | Online Ashtanga & Hatha Yoga Teacher Training Mysore',
    description: 'Experience traditional Mysore yoga online. Certified TTC, Philosophy, and Ayurveda courses led by Dr. Srinatha. Yoga Alliance & YACP accredited.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Srinatha Yoga School | Online Ashtanga & Hatha Yoga Teacher Training Mysore',
    description: 'Experience traditional Mysore yoga online. Certified TTC, Philosophy, and Ayurveda courses led by Dr. Srinatha. Yoga Alliance & YACP accredited.',
  },
}

export const viewport: Viewport = {
  themeColor: '#264020',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
