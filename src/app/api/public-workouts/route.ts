// src/api/workout/isPublic/route.ts

import { dbConnect } from '@/lib/dbConnect';
import UserModal, {UserDocument} from '@/models/userSchema';
import {User} from '@/types/user';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { FeedWorkout } from '@/types';

export async function GET(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nGET All Public Workouts API called');
  try {
    const { searchParams } = new URL(req.url);
    // Get the page number and the number of items per page from the query parameters
    const page = parseInt(searchParams.get('page') ?? '1');
    const itemsPerPage = parseInt(searchParams.get('itemsPerPage') ?? '10');

    // logs
    logger.info(`Page number : ${page}`);
    logger.info(`Items per page : ${itemsPerPage}`);

    // Connect to the database
    await dbConnect();

    // Aggregate function to fetch public workouts with pagination
    // 1. $unwind deconstructs an array field from the input documents to output a document for each element
    // 2. $match filters the documents to pass only documents that match the specified condition, which is "workouts.public": true
    // 3. $sort sorts the documents based on the workouts' _id in descending order (-1), which means the most recent workouts come first
    // 4. $skip skips the first (page - 1) * itemsPerPage documents where page is the current page and itemsPerPage is the number of items per page
    // 5. $limit limits the result to itemsPerPage documents
    const result = await UserModal.aggregate([
      { $unwind: '$workouts' },
      { $match: { 'workouts.public': true } },
      { $sort: { 'workouts._id': -1 } },
      { $skip: (page - 1) * itemsPerPage },
      { $limit: itemsPerPage },
    ]);

    logger.info(`Result: ${JSON.stringify(result)}`);

    if (!result) {
      logger.info('No public workouts found');
      return new NextResponse('No public workouts found', { status: 404 });
    }

    
    const retData: FeedWorkout[] = result.flatMap((user) => {
      console.log("User: ", user);
      
      let feedWorkout: FeedWorkout = {
        ownerName: user.name,
        ownerId: user.userId,
        _id: user.workouts._id,
        name: user.workouts.name,
        exercises: user.workouts.exercises,
        public: user.workouts.public,
        postDate: user.workouts.postDate,
        likes: user.workouts.likes,
        comments: user.workouts.comments,
        saves: user.workouts.saves
      };
      //console.log("Feedworkout: ", feedWorkout);
      return feedWorkout;
    }); 

    console.log("Return data: ", retData);

    logger.info(`Public workouts after filtering :`);
    logger.info(retData);

    return NextResponse.json(retData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`GET Error getting public workouts: ${error.message}`);
      return NextResponse.json(
        {
          error: error.message,
          message: 'Something went wrong, please try again or contact support',
        },
        { status: 500 }
      );
    }
    logger.error(`GET Error getting public workouts: ${error}`);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong, please try again or contact support',
      },
      { status: 500 }
    );
  }
}
