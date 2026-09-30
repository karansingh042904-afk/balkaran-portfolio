import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Balkaran | Senior Full-Stack Engineer & Creative Technologist',
  description:
    'Portfolio of Balkaran - High-performance web applications, interactive 3D WebGL experiences, and scalable cloud systems.',
  keywords: [
    'Balkaran',
    'Full-Stack Engineer',
    'Creative Technologist',
    'Next.js',
    'React',
    'Three.js',
    'Supabase',
    'Portfolio',
  ],
  authors: [{ name: 'Balkaran' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-[#08090C] text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
