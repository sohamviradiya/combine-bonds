import { NextResponse } from "next/server";
import invokeMain from "@/server/tasks/main";
let k = 0;
export async function GET() {
	await invokeMain();
	return NextResponse.json({ message: "Done" });
}
