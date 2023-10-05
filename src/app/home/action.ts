"use server";

import { hostname } from '@/global.config';
import MainRun from '@/server/main/run.main';

export async function fetchMarketAnalytics() {
    const response = await fetch(`${hostname}/api/admin/`, {
        method: "GET",
    });
    const data = await (response.json() as ReturnType<typeof MainRun>);
    return data.analytics;
};
