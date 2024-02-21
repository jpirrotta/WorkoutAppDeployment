// src/app/api/userWorkouts/route.js
// code to handle userWorkouts api endpoints

import {dbConnect} from "@/lib/dbConnect";
// for future use
import UserWorkouts from "@/models/userWorkouts";
export async function GET() {
  try{
    await dbConnect();
    return new Response('<h1>Hello, Marcel!</h1><p>if you see this the db connected successfully</p>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}
