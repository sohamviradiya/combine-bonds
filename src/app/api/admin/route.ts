import MainRun from "@/server/main/run.main";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { key } = await request.json();
    if (key !== process.env.ADMIN_KEY) return NextResponse.json({ message: "Incorrect key" }, { status: 403 });

    const data_response = await fetch(`/api/data`, {
        method: "GET",
    });

    const { agencies, bots, stocks, } = await data_response.json();

    return NextResponse.json(await MainRun({ agencies, bots, stocks }));
};

