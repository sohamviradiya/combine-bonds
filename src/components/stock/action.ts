"use server";

import { getStockBasicInfo } from '@/server/services/stock.service';

export async function fetchStock({ id }: { id: string; }) {
    return await getStockBasicInfo(id);
};


