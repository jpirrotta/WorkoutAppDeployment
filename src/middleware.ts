
import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import logger from '@/lib/logger';

// Log the log level
logger.info(`initializing clerkMiddleware`);

const isProtectedRoute = createRouteMatcher(['/about-us']);

export default clerkMiddleware((auth, req) => {
  if (!auth().userId && isProtectedRoute(req)) {
    console.log('Redirecting to sign in');

    return auth().redirectToSignIn();
  }
  console.log('User is signed in');
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
