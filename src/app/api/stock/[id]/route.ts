import StockService from "@/server/services/stock.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) { 
	const stock = await StockService.get(params.id);
	return NextResponse.json({ name: stock.name,price: stock.price });
}
