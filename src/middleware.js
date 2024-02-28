// https://github.com/clerk/javascript/issues/2435
// using import { authMiddleware } from '@clerk/nextjs'; as in the docs causes some issues when building the app
// the git issue above suggests using import { authMiddleware } from '@clerk/nextjs/server'; instead
// which solves the issue

import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/sign-in',],
  // Routes that can always be accessed, and have
  // no authentication information
  // ignoredRoutes: [""],
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
