import PortfolioService from "@/server/services/portfolio.service";
import { NextResponse } from "next/server";
export async function PUT(request: Request) {
	const body = await request.json();
	const { name, password } = body;
	const user = await PortfolioService.verify(name, password);
	if (user.message === "Success")
		return NextResponse.json({ id: user.portfolio });
	else return NextResponse.json({ message: user.message });
}

export async function POST(request: Request) {
	const body = await request.json();
	console.log(body);
	const { id } = body;
	console.log(body);
	const portfolio = await PortfolioService.get(id);
	return NextResponse.json({ portfolio: portfolio });
}
