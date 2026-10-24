import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Developer Portfolio — Projects, About Me & Contact',
  description:
    'Modern developer portfolio showcasing unlisted YouTube video demos, engineering highlights, dynamic CV viewer, and direct contact channels.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark scroll-smooth h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-neutral-950 text-neutral-100 selection:bg-amber-500/30 selection:text-amber-200"
      >
        {children}
      </body>
    </html>
  );
}
