import { NextResponse } from "next/server";
import invokeMain from "@/server/tasks/main";
import connectDb from "@/server/mongoose.main";
let k = 0;
export async function GET() {
	// await invokeMain();
	await connectDb();
	return NextResponse.json({ message: "Done" });
}
