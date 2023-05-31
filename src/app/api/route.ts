import { NextResponse } from "next/server";
import connectDb from "backend/mongoose.main";
import CompanyGenerator from "backend/generators/company.generator";
import StockGenerator from "backend/generators/stocks.generator";
import AgencyGenerator from "backend/generators/agency.generator";
import CompanyService from "backend/services/company.service";
import StockService from "backend/services/stock.service";
import AgencyService from "backend/services/agency.service";
export async function GET() {
	await connectDb();
	return NextResponse.json({
		
	});
}
