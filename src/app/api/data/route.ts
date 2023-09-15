import MainConnect from "@/server/main/mongoose.main";
import MainSeed from "@/server/main/seed.main";

import { getAllAgencies } from "@/server/services/agency.service";
import { getAllBots } from "@/server/services/bot.service";
import { getAllStocks } from "@/server/services/stock.service";
import { NextResponse } from "next/server";

export async function GET() {
    let agencies: string[] = [];
    let bots: string[] = [];
    let stocks: string[] = [];
    await MainConnect();

    agencies = await getAllAgencies();
    if (agencies.length === 0) {
        await MainSeed();
        agencies = await getAllAgencies();
    }

    bots = await getAllBots();
    stocks = await getAllStocks();
    return NextResponse.json({
        agencies,
        bots,
        stocks,
    });
}