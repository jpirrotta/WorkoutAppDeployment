// src/app/api/profile.ts
import { dbConnect } from '@/lib/dbConnect';
import logger from '@/lib/logger';
import UserModel from '@/models/userSchema';
import { NextRequest, NextResponse } from 'next/server';

//? if used elsewhere, this function should be moved to utils folder
/**
 * Cleans the user object by removing sensitive fields.
 *
 * @param {any} obj - The user object to clean.
 * @returns {any} - The cleaned user object.
 */
function cleanObject(obj: any): any {
  delete obj?._id;
  delete obj?.__v;
  return obj;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  logger.info('GET Profile API called');
  try {
    const searchParams = req.nextUrl.searchParams;
    // Get the userId from the query parameters
    const userId = searchParams.get('userId');
    logger.info(`GET Request userId: ${userId}`);

    await dbConnect();
    const user = await UserModel.findOne({ userId: userId })
      .select(
        'userId name profile.age profile.gender profile.weight profile.height profile.bodyFat'
      )
      .lean();

    if (!user) {
      logger.info('GET User not found / has not saved data yet');
      return NextResponse.json(
        {
          error: 'User not found / has not saved data yet',
          message:
            'Update your profile to get started, or contact support if you already have',
        },
        {
          status: 404,
        }
      );
    }
    logger.info(`GET User found`);
    /* Ideally because the use on lean we will only need return the user object as
        is converts it to a plain object. 
        Currently this function is buggy with nested documents/arrays/objects
        see https://github.com/Automattic/mongoose/issues/13772
        thats why i use this workaround */
    cleanObject(user); // remove _id and __v this is temporary until the lean bug is fixed
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    logger.error(`GET Error getting profile: ${errorMessage}`);

    return NextResponse.json(
      {
        error: errorMessage,
        message: 'Something went wrong, please try again or contact support',
      },
      { status: 500 }
    );
  }
}
