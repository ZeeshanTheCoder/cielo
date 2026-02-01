'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Moon, Wand2, Loader2, Lightbulb, Bot, Palette } from 'lucide-react';
import { useState } from 'react';
import { getDreamInterpretation, type DreamInterpretation } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/use-translation';


export default function DreamJournalPage() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useTranslation();

  const handleInterpret = async () => {
    if (dream.trim().length < 20) {
        toast({
            variant: 'destructive',
            title: 'Dream is too short',
            description: 'Please describe your dream in a bit more detail.',
        });
        return;
    }
    setIsLoading(true);
    setInterpretation(null);
    const result = await getDreamInterpretation(dream, language);
    if (result?.sentiment === 'Error') {
        toast({
            variant: 'destructive',
            title: 'Interpretation Failed',
            description: result.analysis,
        });
    } else {
        setInterpretation(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">AI Dream Journal</h1>
        <p className="text-lg text-muted-foreground">Unlock the secrets of your subconscious mind.</p>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Dream</CardTitle>
            <CardDescription>Our AI will analyze its meaning and symbolism.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="Last night, I dreamt of flying over a city made of crystal..." 
              className="min-h-[250px]" 
              value={dream}
              onChange={(e) => setDream(e.target.value)}
            />
            <Button className="w-full" onClick={handleInterpret} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Interpreting...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Interpret Dream
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dream Analysis</CardTitle>
            <CardDescription>Insights from your subconscious.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
                 <div className="flex h-[320px] items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <Bot className="mx-auto h-12 w-12 animate-pulse" />
                        <p className="mt-2">Our AI is diving deep into your dream...</p>
                    </div>
                </div>
            )}
            {!isLoading && !interpretation && (
                 <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                    <p>Your dream interpretation will appear here.</p>
                </div>
            )}
            {interpretation && interpretation.sentiment !== 'Error' && (
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Palette className="text-primary"/> Overall Sentiment</h3>
                        <Badge variant="outline" className="text-base mt-1">{interpretation.sentiment}</Badge>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="text-primary"/> Core Analysis</h3>
                        <p className="text-muted-foreground mt-1">{interpretation.analysis}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Wand2 className="text-primary"/> Key Symbols</h3>
                        <Accordion type="single" collapsible className="w-full mt-2">
                           {interpretation.symbols.map((s, i) => (
                             <AccordionItem value={`item-${i}`} key={i}>
                               <AccordionTrigger>{s.symbol}</AccordionTrigger>
                               <AccordionContent>
                                 {s.meaning}
                               </AccordionContent>
                             </AccordionItem>
                           ))}
                        </Accordion>
                    </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
