'use client';

import { getAffirmation } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import {
  RefreshCw,
  PenSquare,
  Headphones,
  Music,
  Moon,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

const quickLinks = [
  {
    href: '/journal',
    title: 'Mood Journal',
    description: 'Reflect on your day and gain new insights.',
    icon: PenSquare,
    pro: false,
  },
  {
    href: '/meditations',
    title: 'Meditate',
    description: 'AI-guided sessions to find your inner peace.',
    icon: Headphones,
    pro: false,
  },
  {
    href: '/soundscapes',
    title: 'Soundscapes',
    description: 'Transport your mind to a tranquil environment.',
    icon: Music,
    pro: false,
  },
  {
    href: '/dream-journal',
    title: 'Dream Journal',
    description: 'Unlock the secrets of your subconscious.',
    icon: Moon,
    pro: true,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [affirmation, setAffirmation] = useState('');
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState('Welcome');
  const { language } = useTranslation();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const fetchAffirmation = useCallback(() => {
    startTransition(async () => {
      const zodiacSign = user?.isUpgraded ? user.zodiacSign : null;
      const birthdate = user?.isUpgraded ? user.birthdate : null;
      const result = await getAffirmation({ zodiacSign, birthdate, language });
      if (result.startsWith('Could not generate')) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result,
        });
      } else {
        setAffirmation(result);
      }
    });
  }, [user, toast, language]);

  useEffect(() => {
    fetchAffirmation();
  }, [fetchAffirmation]);

  const affirmationBg = PlaceHolderImages.find(
    p => p.id === 'dashboard-affirmation-bg'
  );

  return (
    <div className="container mx-auto space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl break-words">
            {greeting}, {user?.username}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base md:text-lg mt-1">
            Here is your daily affirmation to guide you.
          </p>
        </div>
        <Button
          onClick={fetchAffirmation}
          disabled={isLoading}
          variant="outline"
          className="w-full sm:w-auto shrink-0"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">New Affirmation</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      <Card className="relative flex min-h-[250px] w-full items-center justify-center overflow-hidden rounded-xl border-none p-4 text-center shadow-lg sm:min-h-[300px] sm:p-8">
        {affirmationBg && (
          <Image
            src={affirmationBg.imageUrl}
            alt="Affirmation background"
            fill
            className="object-cover"
            data-ai-hint={affirmationBg.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-3xl text-white px-2 sm:px-4">
          {isLoading && !affirmation ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-white/80 sm:text-base md:text-lg">
                Generating your affirmation...
              </p>
            </div>
          ) : (
            <blockquote className="space-y-2 sm:space-y-4">
              <p className="font-headline text-xl font-medium leading-tight sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl break-words">
                &ldquo;{affirmation}&rdquo;
              </p>
              <footer className="text-xs text-primary sm:text-sm md:text-base">
                Your Daily Focus
              </footer>
            </blockquote>
          )}
        </div>
      </Card>

      <div>
        <h2 className="font-headline text-xl font-bold tracking-tight mb-4 sm:text-2xl">
          Explore
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map(link => (
            <Link href={link.href} key={link.href} className="flex">
              <Card className="flex w-full flex-col transition-colors hover:border-primary/50 hover:bg-card/80">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <link.icon className="h-8 w-8 text-primary" />
                    {link.pro && !user?.isUpgraded && (
                      <Badge variant="secondary">Pro</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <CardTitle className="text-lg font-semibold">
                    {link.title}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm">
                    {link.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {!user?.isUpgraded && (
        <Card className="bg-gradient-to-r from-primary/10 to-card">
          <CardHeader className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Unlock Your Full Potential
              </CardTitle>
              <CardDescription>
                Upgrade to Cielo Pro for personalized affirmations, dream
                analysis, and more.
              </CardDescription>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/pricing">
                Upgrade Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
