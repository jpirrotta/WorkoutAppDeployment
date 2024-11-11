import { dbConnect } from '@/lib/dbConnect';
import logger from '@/lib/logger';
import UserModel from '@/models/userSchema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
  logger.info('GET insights API called');
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    logger.info(`GET Request userId: ${userId}`);

    await dbConnect();
    const user = await UserModel.findOne({ userId: userId })
      .select('profile weightHistory bodyFatHistory workoutHistory')
      .lean();

    if (!user) {
      logger.info('GET user insights not found / has not saved data yet');
      return NextResponse.json(
        {
          error: 'User not found / has not saved data yet',
          message:
            'Seem like you have not saved any data yet, please save some data to get started',
        },
        {
          status: 404,
        }
      );
    }

    logger.info(`GET User insights found`);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    logger.error(`GET Error getting insights: ${errorMessage}`);

    return NextResponse.json(
      {
        error: errorMessage,
        message: 'Something went wrong, please try again or contact support',
      },
      { status: 500 }
    );
  }
}
