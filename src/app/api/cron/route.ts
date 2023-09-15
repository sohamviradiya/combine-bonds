
import { NextResponse } from "next/server";

export async function POST() {
    const response = await fetch(`/api/admin`, {
        method: "POST",
        body: JSON.stringify({
            key: process.env.ADMIN_KEY,
        }),
    });
    return NextResponse.json({ ...await response.json() });
};
