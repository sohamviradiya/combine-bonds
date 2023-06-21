import PortfolioService from "@/server/services/portfolio.service";
import { Transaction } from "types/portfolio.interface";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
	const body = await request.json();
	const { _id, transaction }: { _id: string; transaction: Transaction } = body;
	await PortfolioService.performTransactions(_id, [transaction]);
	return NextResponse.json({ message: "Done" });
}
