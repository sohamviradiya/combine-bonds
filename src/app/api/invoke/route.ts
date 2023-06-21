import { NextResponse } from "next/server";
import generateMain from "@/server/generator.main";
import cronMain from "@/server/cron.main";
import connectDb from "@/server/mongoose.main";
export async function GET() {
	await connectDb();
	await generateMain();
	await cronMain();
	return NextResponse.json({ message: "Done" });
}
