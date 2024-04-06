// src/api/workout/isPublic/route.js

import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';

export async function GET(req, res) {
  logger.info('\n\nGET All Public Workouts API called');
  try {
    const { searchParams } = new URL(req.url);
    // Get the page number and the number of items per page from the query parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const itemsPerPage = parseInt(searchParams.get('itemsPerPage')) || 10;

    // loges
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
    const result = await User.aggregate([
      { $unwind: "$workouts" },
      { $match: { "workouts.public": true } },
      { $sort: { "workouts._id": -1 } },
      { $skip: (page - 1) * itemsPerPage },
      { $limit: itemsPerPage }
    ]);

    logger.info(`Public workouts sss :\n ${JSON.stringify(result)}`);

    // filter sensitive data and data that is not needed
    // we exclude profile, weight history, fatPercentage history
    const retData = result.map((user) => {
      const { profile, weightHistory, bodyFatHistory, __v, ...rest } = user;
      return rest;
    });

    logger.info(`Public workouts after filtering :`);
    logger.info(retData);

    return new Response(JSON.stringify(retData), { status: 200 });
  } catch (error) {
    logger.error(error);
    return new Response(JSON.stringify('Internal server error', { status: 500 }));
  }
}
