// src/api/workout/isPublic/route.ts

import { dbConnect } from '@/lib/dbConnect';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

// Type and Schema
import { FeedWorkout } from '@/types';
import UserModal from '@/models/userSchema';


const DEFAULT_IMAGE_URL = "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg";

export async function GET(req: NextRequest): Promise<NextResponse> {
  logger.info('GET All Public Workouts API called');
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
      {
        $lookup: {
          from: 'users', // The collection to join with
          localField: 'workouts.comments.userId', // The field from the input documents
          foreignField: 'userId', // The field from the documents of the "from" collection
          as: 'commentUsers', // The name of the new array field to add to the input documents
        },
      },
      {
        $addFields: {
          'workouts.comments': {
            $map: {
              input: '$workouts.comments',
              as: 'comment',
              in: {
                $mergeObjects: [
                  '$$comment',
                  {
                    name: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: '$commentUsers',
                                as: 'user',
                                cond: { $eq: ['$$user.userId', '$$comment.userId'] },
                              },
                            },
                            as: 'user',
                            in: '$$user.name',
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);

    // --- INFO FOR DEBUGGING ---
    //logger.info(`Result: ${JSON.stringify(result, null, 2)}`);

    if (!result) {
      logger.info('No public workouts found');
      return new NextResponse('No public workouts found', { status: 404 });
    }

    const retData: FeedWorkout[] = await Promise.all(result.map(async (user) => {
      // Fetch the owner of the post profile pic
      try {
        const userResponse = await clerkClient().users.getUser(user.userId);
        user.pfpImageUrl = userResponse.imageUrl; // Add the user's profile pic to the comment
      } catch (err) {
        console.error(`Error fetching user for user ${user.userId}:`, err);
        user.pfpImageUrl = DEFAULT_IMAGE_URL; // Add an empty profile pic to the comment
      }

      // Fetch the commenters' profile pics
      for (const comment of user.workouts.comments) {
        try {
          const userResponse = await clerkClient().users.getUser(comment.userId);
          comment.pfpImageUrl = userResponse.imageUrl; // Add the user's profile pic to the comment
        } catch (err) {
          console.error(`Error fetching user for comment ${comment.userId}:`, err);
          comment.pfpImageUrl = DEFAULT_IMAGE_URL; // Add an empty profile pic to the comment
        }
      }

      let feedWorkout: FeedWorkout = {
        ownerName: user.name,
        ownerId: user.userId,
        ownerPfpImageUrl: user.pfpImageUrl,
        _id: user.workouts._id,
        name: user.workouts.name,
        exercises: user.workouts.exercises,
        public: user.workouts.public,
        postDate: user.workouts.postDate,
        likes: user.workouts.likes,
        comments: user.workouts.comments,
        saves: user.workouts.saves
      };
      return feedWorkout;
    }));

    // --- INFO FOR DEBUGGING ---
    //logger.info(`Public workouts after filtering:}`);
    //logger.info(retData);

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
