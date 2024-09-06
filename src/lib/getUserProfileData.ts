import logger from './logger';
import { User } from '@/types';

export default async function getUserProfileData(
  id: string
): Promise<User | null> {
  try {
    const response = await fetch(`/api/profile?userId=${id}`, {
      method: 'GET',
    });

    // if the status is 404, the user is not found, which means that it's a new user
    // and he has never saved any data yet (profile data) therefore we return null as there is no error
    if (response.status === 404) {
      logger.info('User not found / has not saved data yet');
      return null;
    }
    // if the response is not ok (other than 200 or 404), throw an error
    if (!response.ok) {
      throw new Error('Network response for getUserProfileData failed');
    }
    // get only the userId, username and profile data
    // the json contains other data that we don't need
    const { userId, name, profile }: User = await response.json();
    const data: User = { userId, name, profile };

    logger.info(`User profile data: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    logger.error(`Error getting user profile data: ${error}`);
    return null;
  }
}
