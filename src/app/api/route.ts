import { NextResponse } from "next/server";
import connectDb from "backend/mongoose.main";

export async function GET() {
	await connectDb();
	return NextResponse.json({
	});
}
