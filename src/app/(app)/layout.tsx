'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import MainNav from '@/components/main-nav';
import { Loader, Gem } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const proRoutes = ['/dream-journal', '/journal-history'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If loading is finished and the user is not logged in, redirect to login.
    if (!isLoading && !isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // While checking auth state or if the user is not logged in (and about to be redirected),
  // show a loading screen. This prevents a flash of protected content.
  if (isLoading || !isLoggedIn) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // At this point, we know the user is logged in.
  const isProRoute = proRoutes.includes(pathname);
  const canAccess = !isProRoute || (isProRoute && user?.isUpgraded);

  return (
    <div className="relative flex min-h-screen w-full flex-col md:flex-row">
      <MainNav />
      <main className="w-full flex-1 pt-14 md:pt-0 md:pl-16">
        {canAccess ? (
          children
        ) : (
          <div className="container mx-auto flex h-full items-center justify-center p-4 sm:p-6 md:p-8">
            <Card className="max-w-md text-center">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Upgrade to Pro</CardTitle>
                <CardDescription>This feature is available exclusively for Pro members.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">Unlock this page and many more by upgrading your plan.</p>
                <Button asChild>
                  <Link href="/pricing">
                    <Gem className="mr-2 h-4 w-4" />
                    View Pro Plans
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
