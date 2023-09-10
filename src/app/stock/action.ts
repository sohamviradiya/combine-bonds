"use server";

import { getStocksByQuery } from "@/server/services/stock.service";

export async function fetchStocksByQuery({ query, page }: { query: string, page: number }) {
    return await getStocksByQuery(query, page, 8);
};