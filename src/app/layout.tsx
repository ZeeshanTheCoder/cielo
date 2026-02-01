import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { LanguageProvider } from '@/context/language-context';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Cielo',
  description: 'Find your inner balance with AI-powered affirmations.',
};

export const viewport: Viewport = {
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <FirebaseClientProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
