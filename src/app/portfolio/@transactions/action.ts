"use server";

import { getPortfolioTransactions } from "@/server/services/portfolio.service";

export async function fetchTransactions({ id, page }: { id: string; page: number }) {
    return await getPortfolioTransactions(id, page);
}