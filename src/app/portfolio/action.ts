"use server";

import { getPortfolioById } from "@/server/services/portfolio.service";

export async function fetchPortfolio({ id }: { id: string }) {
    return await getPortfolioById(id);
}