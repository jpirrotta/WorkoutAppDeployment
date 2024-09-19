'use server';

import { dbConnect } from './dbConnect';
import UserModel from '@/models/userSchema';
import { User } from '@/types/user';
import logger from './logger';

export const createUser = async (userId: string, name: string) => {
  try {
    await dbConnect();
    const newUser: User = {
      userId,
      name,
    };
    await UserModel.create(newUser);
    logger.info(`User created: ${newUser.userId}`);
  } catch (err) {
    logger.error(`Error creating user in webhook: ${err}`);
    throw new Error(`Error creating user: ${err}`);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await dbConnect();
    const deletedUser = await UserModel.findOneAndDelete({ userId })
      .select('userId name')
      .lean();
    if (!deletedUser) {
      logger.info(`User not found: ${userId}`);
      return;
    }
    logger.info(`User deleted: ${deletedUser.userId}`);
  } catch (err) {
    logger.error(`Error deleting user in webhook: ${err}`);
    throw new Error(`Error deleting user: ${err}`);
  }
};

export const updateUser = async (userId: string, name: string) => {
  try {
    await dbConnect();
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId },
      {
        userId,
        name,
      },
      { new: true }
    )
      .select('userId name')
      .lean();
    if (!updatedUser) {
      logger.info(`User not found: ${userId}`);
      return;
    }
    logger.info(`User updated: ${updatedUser.userId}`);
  } catch (err) {
    logger.error(`Error updating user: ${err}`);
  }
};
