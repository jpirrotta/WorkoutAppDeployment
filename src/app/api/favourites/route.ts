// src/api/favourites/route.ts

import { dbConnect } from '@/lib/dbConnect';
import logger from '@/lib/logger';
import UserModel from '@/models/userSchema';
import { NextRequest, NextResponse } from 'next/server';

// Get the user's favorite exercises
export async function GET(req: NextRequest): Promise<NextResponse> {
    logger.info('GET User Favorites API called');

    try{
        await dbConnect();
        const searchParams = new URL(req.url).searchParams;

        // Get the user ID from the query parameters
        const userId = searchParams.get('userId');
        if (!userId) {
            return new NextResponse('No userId provided, please provide a userId', { status: 404 });
        }

        // Find the user by the user ID, and return the list of favorite exercises
        const user = await UserModel
            .findOne({ userId })
            .select('favExercises')
            .lean();
        
        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        return new NextResponse(JSON.stringify(user.favExercises), { status: 200 });
    }
    catch (error) {
        logger.error('Failed to get user favorites:', error);
        return new NextResponse('Failed to get user favorites', { status: 500 });
    }
}