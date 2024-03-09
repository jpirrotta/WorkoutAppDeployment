// https://github.com/clerk/javascript/issues/2435
// using import { authMiddleware } from '@clerk/nextjs'; as in the docs can causes some issues when building the app
// the git issue above suggests using import { authMiddleware } from '@clerk/nextjs/server'; if the above import causes issues

import { authMiddleware } from '@clerk/nextjs';
import logger from '@/lib/logger.js';
import { NextResponse } from "next/server";


// Log the log level
logger.info(`initializing authMiddleware`);

export default authMiddleware({
  afterAuth: (auth, req, evt) => {
    logger.info(`initializing afterAuth`);
    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      logger.info(`User is logged in and trying to access a protected route`);
      return NextResponse.next();
    }
    // Allow users visiting public routes to access them
    logger.info(`User is visiting a public route`);
    return NextResponse.next();
  },
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/sign-in'],
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
