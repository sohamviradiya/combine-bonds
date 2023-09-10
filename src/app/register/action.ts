"use server";

import { addPortfolio } from "@/server/services/portfolio.service";

export async function registerPortfolio({ name, password, bio }: { name: string, password: string, bio: string }) {
    return await addPortfolio({ name, password, bio });
}