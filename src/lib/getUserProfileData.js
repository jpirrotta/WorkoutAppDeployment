import logger from './logger';

export default async function getUserProfileData(id) {
  try {
    const response = await fetch(`/api/profile?userId=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // if the status is 404, the user in not found, which means that it's a new user
    // and he is never saved any data yet (profile data) therefore we return null as there is no error
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
    const {userId, name, profile} = await response.json();
    const data = {userId, name, profile};

    logger.info(`User profile data: ${JSON.stringify(data)}`);
    return data;
  } catch (error) {
    logger.error(`Error getting user profile data: ${error}`);
    return null;
  }
}
