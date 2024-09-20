import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import logger from '@/lib/logger';

// Log the log level
logger.info(`initializing clerkMiddleware`);

const isProtectedRoute = createRouteMatcher([
  '/account(/.*)?',
  '/calculators(/.*)?',
  '/dashboard',
  '/feed',
  '/profile',
  '/workouts(/.*)?',
  '/(api|trpc)(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {
    console.log('Redirecting to sign in');

    return auth().redirectToSignIn();
  }
  console.log('User is signed in');
});
