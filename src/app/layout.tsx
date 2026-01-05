import type { Metadata } from 'next';
import { AppProvider } from '@/lib/context';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ComparaRemesas - Envía dinero a LATAM sin pagar de más',
  description: 'Compara tasas y comisiones de los mejores servicios de remesas. Ahorra hasta 80% en fees enviando dinero a México, Colombia, Perú y más.',
  keywords: 'remesas, enviar dinero, LATAM, México, Colombia, Perú, Wise, Remitly, Western Union, comparar',
  authors: [{ name: 'ComparaRemesas' }],
  openGraph: {
    title: 'ComparaRemesas - Envía dinero a LATAM sin pagar de más',
    description: 'Compara tasas y comisiones de los mejores servicios de remesas.',
    type: 'website',
    locale: 'es_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ComparaRemesas',
    description: 'Compara tasas y comisiones de los mejores servicios de remesas.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#0a0f1c',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
