import type {Metadata} from 'next';
import {Vazirmatn} from 'next/font/google';
import '@/styles/globals.css';
import React from 'react';
import Providers from '@/providers/Providers';
import {getThemeInitScript} from '@/lib/config/theme';

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ImageTranslate AI',
  description: 'Upload an image and translate text instantly',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: getThemeInitScript(),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
