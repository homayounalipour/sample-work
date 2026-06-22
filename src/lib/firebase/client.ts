'use client';

import {getApp, getApps, initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirebaseConfig} from '@/lib/firebase/config';

const app = getApps().length ? getApp() : initializeApp(getFirebaseConfig());

export const auth = getAuth(app);
