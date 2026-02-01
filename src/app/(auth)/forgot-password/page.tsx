'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await sendPasswordReset(values.email);
      setIsSent(true);
      toast({
        title: 'Check your email',
        description:
          'If an account exists for that email, a reset link has been sent.',
      });
    } catch (error) {
      console.error(error);
       toast({
        variant: 'destructive',
        title: 'Request Failed',
        description: 'There was a problem sending the reset email. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Forgot Password</CardTitle>
        <CardDescription>
          {isSent
            ? 'A reset link has been sent. Please check your email.'
            : "Enter your email and we'll send you a link to reset your password."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <Button className="w-full" asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
        )}
        <div className="mt-4 text-center text-sm">
          Remembered your password?{' '}
          <Link href="/login" className="text-primary underline">
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
