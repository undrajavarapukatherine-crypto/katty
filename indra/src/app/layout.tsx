import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'INDRA — Industrial Neural Decision & Reasoning Assistant',
  description: 'Air-gapped, on-premise sovereign AI workbench for industrial plant operations',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-[#f8fafc]">
      <body className="h-full bg-[#f8fafc] text-slate-900 antialiased overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
