import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BhuInfo Nepal — Land Intelligence Platform',
  description: 'Explore land information, risk indicators, ownership categories, and estimated values across Nepal. All data is fictional sample data for demonstration purposes.',
  keywords: ['Nepal land', 'land information', 'GIS Nepal', 'land due diligence', 'Kitta number'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
