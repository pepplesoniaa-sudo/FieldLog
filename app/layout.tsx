import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'FieldLog — Environmental Remediation Daily Site Reporting',
    template: '%s | FieldLog',
  },
  description: 'Capture once on site. Report automatically with zero loss.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'FieldLog — Environmental Remediation Daily Site Reporting',
    description: 'Capture once on site. Report automatically with zero loss.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'FieldLog',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#1B5EAD',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
