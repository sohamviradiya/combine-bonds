
import { NextRequest, NextResponse } from "next/server";
import MainStart from "@/server/main/start.main";


export async function POST(request: NextRequest) {
    const response = await MainStart();
    return NextResponse.json({ response });
}