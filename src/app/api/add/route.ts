import PortfolioService from "@/server/services/portfolio.service";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
	const body = await request.json();
	const { name, password,bio } = body;
     const user = await PortfolioService.add({
          user: {
               name: name,
               password: password,
               bio: bio || "",
          }
     });
     return NextResponse.json({id: user._id});
}
