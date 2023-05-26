import { NextResponse } from "next/server";
import connectDb from "backend/mongoose.main";
import StockModel from "backend/models/stock.schema";
export async function GET() {
	await connectDb();
	return await StockModel.find({})
		.exec()
		.then((data) => {
			console.log(data);
			return NextResponse.json(data);
		})
		.catch((err) => {
			console.log(err);
			return NextResponse.json(err);
		});
}
