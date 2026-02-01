'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import { useState } from 'react';
import { getGuidedMeditation, type GuidedMeditation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';

const meditations = [
  {
    title: 'Morning Gratitude',
    duration: '5 min',
    imageId: 'meditation-gratitude',
  },
  { title: 'Stress Relief', duration: '10 min', imageId: 'meditation-stress' },
  { title: 'Deep Sleep', duration: '15 min', imageId: 'meditation-sleep' },
];

export default function MeditationsPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeMeditation, setActiveMeditation] =
    useState<GuidedMeditation | null>(null);
  const { toast } = useToast();
  const { language } = useTranslation();

  const handlePlay = async (topic: string) => {
    setIsLoading(topic);
    setActiveMeditation(null);
    const result = await getGuidedMeditation(topic, language);
    setIsLoading(null);

    if (result?.title === 'Error') {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: result.script,
      });
    } else {
      setActiveMeditation(result);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="border-b pb-4">
          <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            AI-Powered Guided Meditations
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base md:text-lg mt-1">
            Find your inner peace and calm your mind with unique, AI-generated
            sessions.
          </p>
        </div>
        <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meditations.map(med => {
            const imageUrl = PlaceHolderImages.find(
              p => p.id === med.imageId
            )?.imageUrl;
            const imageHint = PlaceHolderImages.find(
              p => p.id === med.imageId
            )?.imageHint;

            return (
              <Card key={med.title} className="overflow-hidden">
                {imageUrl && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={imageUrl}
                      alt={med.title}
                      fill
                      className="object-cover"
                      data-ai-hint={imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{med.title}</CardTitle>
                  <CardDescription>{med.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => handlePlay(med.title)}
                    disabled={!!isLoading}
                  >
                    {isLoading === med.title ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Dialog
        open={!!activeMeditation}
        onOpenChange={open => !open && setActiveMeditation(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeMeditation?.title}</DialogTitle>
            <DialogDescription>
              Close your eyes, relax, and follow the guidance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activeMeditation?.audioDataUri && (
              <audio controls autoPlay className="w-full">
                <source
                  src={activeMeditation.audioDataUri}
                  type="audio/wav"
                />
                Your browser does not support the audio element.
              </audio>
            )}
            <ScrollArea className="h-40 rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                {activeMeditation?.script}
              </p>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button onClick={() => setActiveMeditation(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
