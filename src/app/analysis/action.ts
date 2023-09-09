"use server";
import { getMarketTimeline, getPredictedStocks, getTrendingStocks } from "@/server/services/market.service";

export async function fetchTrendingStocks() {
    return await getTrendingStocks(8);
};

export async function fetchPredictedStocks() {
    return await getPredictedStocks(8);
};

export async function fetchMarketTimeline() {
    return await getMarketTimeline();
}