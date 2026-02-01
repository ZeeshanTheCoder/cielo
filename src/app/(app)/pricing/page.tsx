'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';

const freeFeatures = [
  'Daily AI Affirmations',
  'Mood Journal & Basic Sentiment',
  'Breathing Exercises',
  'Community Access',
  'Guided Meditations',
  'Soundscapes',
];
const proFeatures = [
  ...freeFeatures,
  'Personalized affirmations (Zodiac & Birthdate)',
  'Advanced Sentiment Analysis',
  'Journal History',
  'AI Dream Journal',
  'Priority Support',
];

export default function PricingPage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  // Show a one-time toast on redirect back from Stripe.
  // We also optimistically update the local profile so the user sees Pro instantly.
  useEffect(() => {
    const run = async () => {
      if (success === '1') {
        try {
          if (user && !user.isUpgraded) {
            await updateProfile({ isUpgraded: true });
          }
          toast({
            title: 'Payment successful!',
            description: 'Welcome to Cielo Pro. Your account has been upgraded.',
          });
        } catch {
          toast({
            title: 'Payment successful!',
            description: 'Payment completed. Your Pro access will reflect shortly.',
          });
        } finally {
          router.replace('/pricing');
        }
      }

      if (canceled === '1') {
        toast({
          variant: 'destructive',
          title: 'Payment canceled',
          description: 'No worries — you can upgrade anytime.',
        });
        router.replace('/pricing');
      }
    };

    // Only run when coming back from Stripe.
    if (success === '1' || canceled === '1') {
      run();
    }
  }, [success, canceled, user, updateProfile, toast, router]);

  const handleUpgrade = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please log in to upgrade your plan.',
      });
      return;
    }

    setIsUpgrading(true);
    try {

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start Stripe checkout.');
      }

      // Redirect to Stripe Checkout.
      window.location.href = data.url;
    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        variant: 'destructive',
        title: 'Upgrade Failed',
        description: error instanceof Error ? error.message : 'Failed to upgrade. Please try again.',
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Choose Your Path</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
          Unlock a more personalized experience and deepen your journey of self-discovery.
        </p>
      </div>

      <div className="mt-8 grid max-w-4xl mx-auto gap-6 sm:mt-12 sm:gap-8 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Standard</CardTitle>
            <CardDescription>For starting your mindfulness journey.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p>
              <span className="font-headline text-3xl font-bold sm:text-4xl">$0</span>
              <span className="text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 text-sm">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-accent" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" disabled>
              Your Current Plan
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary flex flex-col shadow-lg shadow-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-headline text-2xl text-primary">Cielo Pro</CardTitle>
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardDescription>For the dedicated explorer of the self.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <p>
              <span className="font-headline text-3xl font-bold sm:text-4xl">$9</span>
              <span className="text-muted-foreground">/month</span>
            </p>
            <ul className="space-y-2 text-sm">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {user?.isUpgraded ? (
              <Button className="w-full" disabled>
                You are a Pro Member
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleUpgrade}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
