'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * Listens for Firestore permission errors and shows them as toasts
 * instead of crashing the entire application.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      const { request } = error;
      
      // Build detailed error message
      const operation = request.method || 'unknown';
      const path = request.path || 'unknown path';
      const userEmail = request.auth?.token?.email || 'Not logged in';
      const userId = request.auth?.uid || 'No user ID';
      const resourceData = request.resource?.data ? JSON.stringify(request.resource.data, null, 2) : 'No data';
      
      // Detailed description for toast
      const detailedDescription = `Operation: ${operation.toUpperCase()}\nPath: ${path}\nUser: ${userEmail} (${userId})\nData: ${resourceData}`;
      
      // Show detailed error in toast
      toast({
        variant: 'destructive',
        title: 'Firestore Permission Error',
        description: detailedDescription,
        duration: 10000, // Show for 10 seconds
      });

      // Also log full error in console for developers
      console.error('Firestore Permission Error Details:', {
        operation,
        path,
        user: {
          uid: userId,
          email: userEmail,
        },
        resourceData: request.resource?.data,
        fullRequest: request,
      });
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
