import React from "react"
import type { Metadata } from 'next'
import { DM_Sans, Instrument_Serif } from 'next/font/google'
import Script from "next/script";

import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chaiitanyaa Chopraa',
  description: 'Software Developer - Building digital experiences with code and craft.',
  openGraph: {
    title: 'Chaiitanyaa Chopraa',
    description: 'Software Developer - Building digital experiences with code and craft.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased">{children}
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