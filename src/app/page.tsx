'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ArrowRight, BrainCircuit, Headphones, Sparkles, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI Daily Affirmations',
    description: 'Start your day with a unique, AI-generated affirmation to foster motivation and discipline.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Mood & Dream Journal',
    description: 'Track your emotional landscape and interpret your dreams with our intelligent AI analysis.',
  },
  {
    icon: <Headphones className="h-8 w-8 text-primary" />,
    title: 'Guided Meditations',
    description: 'Access a library of guided meditations and calming soundscapes to find your inner peace.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Supportive Community',
    description: 'Connect anonymously with others, share affirmations, and grow in a positive space.',
  },
];

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="font-headline text-2xl font-bold text-foreground">Cielo</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
          <div className="container relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 px-4 py-24 text-center md:py-32">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#ffffff11_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Discover Your Inner Universe
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Cielo is your personal guide to mindfulness and self-discovery.
              Leverage the power of AI to cultivate a positive mindset and unlock your true potential.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start Your Journey <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Celestial Toolkit for Your Mind
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our features are designed to harmonize your mind and spirit,
                  providing clarity and strength for your daily life.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-2 lg:gap-16 pt-12">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center gap-4 p-4 rounded-lg transition-colors hover:bg-background/50">
                  {feature.icon}
                  <h3 className="font-headline text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container flex flex-col items-center justify-center gap-4 py-10 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with purpose. &copy; {new Date().getFullYear()} Cielo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}


export default function Page() {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!isLoading && isLoggedIn) {
        router.replace('/home');
      }
    }, [isLoggedIn, isLoading, router]);
  
    if (isLoading || isLoggedIn) {
      return (
        <div className="flex h-screen flex-col bg-background">
          <header className="sticky top-0 z-50 w-full border-b border-border/40">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
              <Skeleton className="h-8 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </header>
          <main className="flex-1">
            <div className="container flex h-[60vh] flex-col items-center justify-center gap-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-40" />
            </div>
          </main>
        </div>
      );
    }
  
    return <LandingPage />;
  }
