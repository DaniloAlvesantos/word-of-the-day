import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    clientEmail: process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
};

const app =
  getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

export const adminDb = getFirestore(app);
