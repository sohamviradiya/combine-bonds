import { hostname } from "@/global.config";
import MongooseConnect from "@/server/main/mongoose.main";
import MainRun from "@/server/main/run.main";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await MongooseConnect();
    const data_response = await fetch(`${hostname}/api/data`, {
        method: "GET",
    });

    const { agencies, bots, stocks, } = await data_response.json();

    return NextResponse.json(await MainRun({ agencies, bots, stocks }));
};


export const revalidate = 900;
