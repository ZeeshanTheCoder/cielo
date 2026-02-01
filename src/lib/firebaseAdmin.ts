import 'server-only';
import admin from 'firebase-admin';

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY in env.'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      getFirebaseAdminConfig() as admin.ServiceAccount
    ),
  });
}

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();
