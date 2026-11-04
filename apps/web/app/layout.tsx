import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tollgate — The AI Spend Firewall & Key Vault',
  description: 'AI Gateway and Spend Management Platform for Small Teams',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-white text-slate-900">
      <body className="min-h-full bg-white flex flex-col font-sans antialiased text-slate-900">
        {children}
      </body>
    </html>
  );
}
