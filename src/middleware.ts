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

// Define the route to be ignored by the middleware
// webhook routes should be ignored
const ignoreRoute = createRouteMatcher(['/api/webhooks(.*)']);

export default clerkMiddleware((auth, req) => {
  if (ignoreRoute(req)) {
    logger.info('Ignoring /api/webhooks route');
    return;
  }

  if (!auth().userId && isProtectedRoute(req)) {
    logger.info('Redirecting to sign in');

    return auth().redirectToSignIn();
  }
  logger.info('User is signed in or not on a protected route');
});
