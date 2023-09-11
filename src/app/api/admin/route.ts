import MainStart from "@/server/main/start.main";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { key } = await request.json();
    if (key !== process.env.ADMIN_KEY) return NextResponse.json({ message: "Incorrect key" }, { status: 403 });
    return NextResponse.json(await MainStart());
};