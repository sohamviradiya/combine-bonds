"use server";

import { getStockAnalytics, getStockDataById } from "@/server/services/stock.service";

export async function fetchStockData({ id }: { id: string }) {
    return await getStockDataById(id);
}
