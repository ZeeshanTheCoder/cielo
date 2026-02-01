'use client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Headphones, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import {
  getSoundscape,
  getSoundscapeIdeas,
  type Soundscape,
  type SoundscapeIdea,
} from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/use-translation';

export default function SoundscapesPage() {
  const [soundscapes, setSoundscapes] = useState<SoundscapeIdea[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [activeSoundscape, setActiveSoundscape] = useState<Soundscape | null>(
    null
  );
  const { toast } = useToast();
  const { language } = useTranslation();

  const fetchIdeas = useCallback(async () => {
    setIsPageLoading(true);
    const ideas = await getSoundscapeIdeas(6, language);
    if (ideas.length > 0 && ideas[0].title === 'Error') {
      toast({
        variant: 'destructive',
        title: 'Could not load soundscapes',
        description: 'Please try refreshing the page.',
      });
      setSoundscapes([]);
    } else {
      setSoundscapes(ideas);
    }
    setIsPageLoading(false);
  }, [toast, language]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleListen = async (topic: string) => {
    setIsGenerating(topic);
    setActiveSoundscape(null);
    const result = await getSoundscape(topic, language);
    setIsGenerating(null);

    if (result?.title === 'Error') {
      toast({
        variant: 'destructive',
        title: 'Audio Generation Failed',
        description: result.script,
      });
    } else {
      setActiveSoundscape(result);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Soundscapes
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base md:text-lg mt-1">
              Transport your mind to a tranquil environment.
            </p>
          </div>
          <Button
            onClick={fetchIdeas}
            disabled={isPageLoading}
            variant="outline"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isPageLoading ? 'animate-spin' : ''}`}
            />
            Discover New Sounds
          </Button>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isPageLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-40 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            : soundscapes.map(scape => {
                const imageUrl = `https://picsum.photos/seed/${scape.title.replace(
                  /\s/g,
                  '-'
                )}/600/400`;
                return (
                  <Card key={scape.title} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <Image
                        src={imageUrl}
                        alt={scape.title}
                        fill
                        className="object-cover"
                        data-ai-hint={scape.imageHint}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{scape.title}</CardTitle>
                      <CardDescription>{scape.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        onClick={() => handleListen(scape.title)}
                        disabled={!!isGenerating}
                      >
                        {isGenerating === scape.title ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Headphones className="mr-2 h-4 w-4" />
                            Listen
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
        open={!!activeSoundscape}
        onOpenChange={open => !open && setActiveSoundscape(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeSoundscape?.title}</DialogTitle>
            <DialogDescription>
              Find a comfortable position, close your eyes, and listen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {activeSoundscape?.audioDataUri && (
              <audio controls autoPlay className="w-full">
                <source
                  src={activeSoundscape.audioDataUri}
                  type="audio/wav"
                />
                Your browser does not support the audio element.
              </audio>
            )}
            <ScrollArea className="h-40 rounded-md border p-4">
              <p className="text-sm text-muted-foreground">
                {activeSoundscape?.script}
              </p>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button onClick={() => setActiveSoundscape(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
