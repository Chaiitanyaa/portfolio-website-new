import React from "react"
import type { Metadata, Viewport } from 'next'
import { Archivo, Spline_Sans_Mono } from 'next/font/google'
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"

import './globals.css'

/* One superfamily, two widths. Archivo carries a real width axis, so headings
   can run wide and confident while body copy sits at normal width — contrast
   from a single family instead of a pile of them. It was drawn for interfaces
   rather than magazines, which is why it holds up at 11px and at 180px. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
  display: 'swap',
})

// Labels, dates, counts — anything that reads as data rather than prose.
const mono = Spline_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chaiitanyaa.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Chaiitanyaa Chopraa — Software Developer',
    template: '%s — Chaiitanyaa Chopraa',
  },
  description:
    'Software developer in Victoria, BC. Full-stack systems in React, Node and Python — trading engines, AI platforms and procedural tooling. Available for full-time and contract work.',
  keywords: [
    'Chaiitanyaa Chopraa',
    'software developer',
    'full stack developer',
    'Victoria BC developer',
    'React developer',
    'Next.js',
    'Node.js',
    'University of Victoria',
  ],
  authors: [{ name: 'Chaiitanyaa Chopraa', url: SITE_URL }],
  creator: 'Chaiitanyaa Chopraa',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Chaiitanyaa Chopraa — Software Developer',
    description:
      'Full-stack systems in React, Node and Python. Victoria, BC. Available for work.',
    url: SITE_URL,
    siteName: 'Chaiitanyaa Chopraa',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chaiitanyaa Chopraa — Software Developer',
    description:
      'Full-stack systems in React, Node and Python. Victoria, BC. Available for work.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F1F2F3' },
    { media: '(prefers-color-scheme: dark)', color: '#101315' },
  ],
}

// Structured data so search engines read this as a person, not a page of text.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Chaiitanyaa Chopraa',
  jobTitle: 'Software Developer',
  email: 'mailto:reachme@chaiitanyaa.com',
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Victoria',
    addressRegion: 'BC',
    addressCountry: 'CA',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'University of Victoria',
  },
  sameAs: [
    'https://github.com/chaiitanyaa',
    'https://www.linkedin.com/in/chaiitanyaa-chopraa-96ba09229/',
  ],
  knowsAbout: [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'Python', 'Docker', 'PostgreSQL', 'MongoDB', 'Unity',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${mono.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <script
          type="application/ld+json"
          // Static, author-controlled schema object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-FCG0H4KXHC`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', 'G-FCG0H4KXHC', {page_path: window.location.pathname,});
          `}
        </Script>

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vqnaoyrzrf");
          `}
        </Script>
      </body>
    </html>
  )
}
