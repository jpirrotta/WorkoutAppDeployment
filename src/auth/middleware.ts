// https://github.com/clerk/javascript/issues/2435
// using import { authMiddleware } from '@clerk/nextjs'; as in the docs can causes some issues when building the app
// the git issue above suggests using import { authMiddleware } from '@clerk/nextjs/server'; if the above import causes issues

//TODO update the clerk authMiddleware to use the new clerk sdk, make sure to use the correct type

import { authMiddleware } from '@clerk/nextjs/server';
import logger from '@/lib/logger';
import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';

// Log the log level
logger.info(`initializing authMiddleware`);

const options: any = {
  afterAuth: (auth: any, req: NextRequest, evt: NextFetchEvent) => {
    logger.info(`initializing afterAuth`);
    // If the user is logged in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      logger.info(`User is logged in and trying to access a protected route`);
      return NextResponse.next();
    }
    // user is not logged in and trying to access a protected route
    else if (!auth.userId && !auth.isPublicRoute) {
      logger.info(
        `User is not logged in and trying to access a protected route`
      );
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    // Allow users visiting public routes to access them
    logger.info(`User is visiting a public route`);
    return NextResponse.next();
  },
  // Routes that can be accessed while signed out
  publicRoutes: ['/', '/sign-in', '/about-us', '/contact-us'],

  // Routes that can always be accessed, and have
  // no authentication information
  // ignoredRoutes: [""],
};

export default authMiddleware(options);

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
