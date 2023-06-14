import { NextResponse } from "next/server";
import connectDb from "server/mongoose.main";

export async function GET() {
	await connectDb();

	return NextResponse.json({});
}
