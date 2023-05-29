import { NextResponse } from "next/server";
import connectDb from "backend/mongoose.main";
import CompanyService from "backend/services/company.service";

export async function GET() {
	await connectDb();
	return NextResponse.json({
	});
}
