'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function JournalHistoryPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Journal History</h1>
        <p className="text-lg text-muted-foreground">Review your past entries and track your journey.</p>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Your journal history will be displayed here.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-48 items-center justify-center text-muted-foreground">
            <p>No entries yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
