import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Legal Task OS',
  description: 'Manage legal tasks and responsibilities',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex h-screen overflow-hidden antialiased bg-[#121212] text-gray-200 font-sans">
        <Sidebar className="no-print" />
        <main className="flex-1 overflow-y-auto w-full bg-[#121212]">
          {children}
        </main>
      </body>
    </html>
  );
}
