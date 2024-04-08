// src/app/api/user_id.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';



export async function GET(req, res) {
  logger.info('\n\nGET Profile API called');
  try {
    const { searchParams } = new URL(req.url);
    // Get the userId from the query parameters
    const userId = searchParams.get('userId');
    logger.info(`GET Request userId: ${userId}`);
    await dbConnect();
    const user = await User.findOne({ userId: userId });
    if (!user) {
      logger.info('GET User not found / has not saved data yet');
      return new Response('User not found / has not saved data yet', {
        status: 404,
      });
    } else {
      logger.info(`GET User found`);
      return new Response(JSON.stringify(user._id), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    logger.error(`GET Error getting profile: ${error}`);
    return new Response(error.message, { status: 500 });
  }
}