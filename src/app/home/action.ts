"use server";

import { getMarketAnalytics } from '@/server/services/market.service';

export async function fetchMarketAnalytics() {
    return await getMarketAnalytics();
};
