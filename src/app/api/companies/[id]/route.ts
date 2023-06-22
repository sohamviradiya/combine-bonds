import CompanyService from "@/server/services/company.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const company = await CompanyService.get(params.id);
	return NextResponse.json({ ...company });
}
