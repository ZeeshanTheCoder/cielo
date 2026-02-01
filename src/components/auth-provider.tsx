'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import {
  Auth,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  Firestore,
  serverTimestamp,
} from 'firebase/firestore';
import { useFirebase } from '@/firebase/provider';
import { FirestorePermissionError } from '@/firebase/errors';

// This is the shape of the user profile data stored in Firestore
export type UserProfile = {
  uid: string;
  username: string;
  email: string;
  isUpgraded: boolean;
  zodiacSign: string | null;
  birthdate: string | null;
  createdAt: any; // Using 'any' for serverTimestamp
};

// This is the user object available in the AuthContext
type AppUser = Omit<UserProfile, 'createdAt' | 'uid'> & { uid: string };

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: AppUser | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AppUser>) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

async function fetchUserProfile(
  firestore: Firestore,
  user: FirebaseUser
): Promise<AppUser | null> {
  const userRef = doc(firestore, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data() as UserProfile;
    // The user object we expose in the context is slightly different
    // Always use Firebase auth email as source of truth if Firestore email is missing
    return {
      uid: data.uid || user.uid,
      username: data.username || user.displayName || user.email?.split('@')[0] || 'User',
      email: data.email || user.email || '', // Use Firebase auth email if Firestore email is missing
      isUpgraded: data.isUpgraded ?? false,
      zodiacSign: data.zodiacSign ?? null,
      birthdate: data.birthdate ?? null,
    };
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth, firestore, isUserLoading, user: firebaseUser } = useFirebase();
  const [appUser, setAppUser] = useState<AppUser | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem('cielo:user');
      if (stored) {
        const parsed = JSON.parse(stored) as AppUser;
        // Validate that essential fields exist
        if (parsed && parsed.uid && (parsed.email || parsed.username)) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });
  const [isProfileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const syncUser = async () => {
      if (firebaseUser && firestore) {
        setProfileLoading(true);
        try {
          const userProfile = await fetchUserProfile(firestore, firebaseUser);

          if (userProfile) {
            setAppUser(userProfile);
          } else {
            // Fallback: build a minimal profile from the Firebase auth user
            const fallbackUser: AppUser = {
              uid: firebaseUser.uid,
              username:
                firebaseUser.displayName ||
                firebaseUser.email?.split('@')[0] ||
                'User',
              email: firebaseUser.email || '',
              isUpgraded: false,
              zodiacSign: null,
              birthdate: null,
            };
            setAppUser(fallbackUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setAppUser(null);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setAppUser(null);
        setProfileLoading(false);
      }
    };

    if (!isUserLoading) {
      syncUser();
    }
  }, [firebaseUser, firestore, isUserLoading]);

  // Keep a copy of the app user in localStorage for reuse across the app
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (appUser) {
      // Ensure all required fields are present before storing
      const userToStore: AppUser = {
        uid: appUser.uid,
        username: appUser.username || 'User',
        email: appUser.email || firebaseUser?.email || '',
        isUpgraded: appUser.isUpgraded ?? false,
        zodiacSign: appUser.zodiacSign ?? null,
        birthdate: appUser.birthdate ?? null,
      };
      try {
        window.localStorage.setItem('cielo:user', JSON.stringify(userToStore));
      } catch (error) {
        console.error('Failed to save user to localStorage:', error);
      }
    } else {
      window.localStorage.removeItem('cielo:user');
    }
  }, [appUser, firebaseUser]);

  const login = useCallback(
    async (email: string, pass: string): Promise<void> => {
      if (!auth) throw new Error('Firebase Auth not available');
      await signInWithEmailAndPassword(auth, email, pass);
    },
    [auth]
  );

  const signup = useCallback(
    async (
      username: string,
      email: string,
      password: string
    ): Promise<void> => {
      if (!auth || !firestore)
        throw new Error('Firebase services not available');
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      const newUserProfile: UserProfile = {
        uid: user.uid,
        username,
        email,
        isUpgraded: false,
        zodiacSign: null,
        birthdate: null,
        createdAt: serverTimestamp(),
      };

      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, newUserProfile);
    },
    [auth, firestore]
  );

  const logout = useCallback(async (): Promise<void> => {
    if (!auth) throw new Error('Firebase Auth not available');
    await signOut(auth);
  }, [auth]);

  const updateProfile = useCallback(
    async (data: Partial<AppUser>): Promise<void> => {
        if (!appUser || !firestore) {
          throw new Error('User or Firestore not available. Please ensure you are logged in.');
        }
        const userRef = doc(firestore, 'users', appUser.uid);
        try {
          // Use blocking update to ensure the operation completes before returning
          await setDoc(userRef, data, { merge: true });
          setAppUser(prev => prev ? { ...prev, ...data } : null);
        } catch (error) {
          // Re-throw with more context
          if (error instanceof Error) {
            if (error.message.includes('permission') || error.message.includes('Permission')) {
              throw new Error(`Permission denied: Cannot update profile. User ID: ${appUser.uid}, Path: users/${appUser.uid}. Please check Firestore security rules.`);
            }
            throw error;
          }
          throw new Error('Failed to update profile. Please try again.');
        }
    },
    [appUser, firestore]
  );

  const sendPasswordReset = useCallback(
    async (email: string): Promise<void> => {
      if (!auth) throw new Error('Firebase Auth not available');
      await sendPasswordResetEmail(auth, email);
    },
    [auth]
  );

  const value = {
    isLoggedIn: !!firebaseUser,
    isLoading: isUserLoading || (!!firebaseUser && isProfileLoading),
    user: appUser,
    login,
    signup,
    logout,
    updateProfile,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
