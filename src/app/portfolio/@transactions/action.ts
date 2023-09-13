"use server";

import { getPortfolioTransactions } from "@/server/services/portfolio.service";

export async function fetchTransactions({ id, page }: { id: string; page: number }) {
    const transactions = await getPortfolioTransactions(id, page);
    console.log(transactions);
    return transactions;
}