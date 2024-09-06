// src/app/api/profile.ts
import { dbConnect } from '@/lib/dbConnect';
import UserModel, { UserDocument } from '@/models/userSchema';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { Profile } from '@/types';

interface RequestData {
  userId: string;
  name: string;
  profile: Profile;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nPOST Profile API called');
  try {
    // Get the request data
    const data: RequestData = await req.json();
    const { userId, name, profile } = data;
    //

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`name: ${name}`);
    //

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let user: UserDocument | null = await UserModel.findOne({ userId: userId });
    if (!user) {
      // If the user is not found, create a new user
      logger.info('User not found, creating new user');
      user = new UserModel({ userId: userId, name: name, profile: profile });
    } else {
      // If the user is found, update their profile
      logger.info('User found, updating profile');
      // only update the non-empty fields
      if (profile && user.profile) {
        if (profile.age) {
          user.profile.age = profile.age;
        }
        if (profile.bodyFat) {
          user.profile.bodyFat = profile.bodyFat;
        }
        if (profile.gender) {
          user.profile.gender = profile.gender;
        }
        if (profile.height) {
          user.profile.height = profile.height;
        }
      }
    }

    // add the weight to the weight history and
    // the body fat to the body fat history
    if (profile.weight) {
      user.weightHistory?.push({ value: profile.weight, date: new Date() });
    }
    if (profile.bodyFat) {
      user.bodyFatHistory?.push({ value: profile.bodyFat, date: new Date() });
    }
    //

    logger.info(`User being saved`);
    // Save the user (either updated or new)
    await user.save();
    logger.info(`User saved: ${JSON.stringify(user)}`);

    // send the response
    return new NextResponse(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`POST Error updating profile: ${error.message}`);
      return new NextResponse(error.message, { status: 500 });
    }
    logger.error(`POST Error updating profile: ${error}`);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nGET Profile API called');
  try {
    const { searchParams } = new URL(req.url);
    // Get the userId from the query parameters
    const userId = searchParams.get('userId');
    logger.info(`GET Request userId: ${userId}`);
    await dbConnect();
    const user: UserDocument | null = await UserModel.findOne({
      userId: userId,
    });
    if (!user) {
      logger.info('GET User not found / has not saved data yet');
      return new NextResponse('User not found / has not saved data yet', {
        status: 404,
      });
    } else {
      logger.info(`GET User found`);
      const retProfile = {
        profile: user.profile,
      };
      return new NextResponse(JSON.stringify(retProfile), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`GET Error getting profile: ${error.message}`);
      return new NextResponse(error.message, { status: 500 });
    }
    logger.error(`GET Error getting profile: ${error}`);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nDELETE Profile API called');
  try {
    const { searchParams } = new URL(req.url);
    // Get the userId from the query parameters
    const userId = searchParams.get('userId');
    logger.info(`DELETE Request userId: ${userId}`);
    await dbConnect();
    const user: UserDocument | null = await UserModel.findOne({
      userId: userId,
    });
    if (!user) {
      logger.info('DELETE User not found');
      return new NextResponse('User not found', { status: 404 });
    } else {
      logger.info(`DELETE User found`);
      await user.deleteOne();
      logger.info(`DELETE User deleted`);
      return new NextResponse('User deleted', { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`DELETE Error deleting profile: ${error.message}`);
      return new NextResponse(error.message, { status: 500 });
    }
    logger.error(`DELETE Error deleting profile: ${error}`);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
