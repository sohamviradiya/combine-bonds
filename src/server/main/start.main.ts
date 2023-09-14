import { CronJob } from "cron";

import MainRun from "@/server/main/run.main";
import MainConnect from "@/server/main/mongoose.main";
import MainSeed from "@/server/main/seed.main";

import { getAllAgencies } from "@/server/services/agency.service";
import { getAllBots } from "@/server/services/bot.service";
import { getAllPortfolios } from "@/server/services/portfolio.service";
import { getDate } from "@/server/services/market.service";
import { getAllStocks } from "@/server/services/stock.service";

import { SLOT_DURATION } from "@/server/global.config";

let agencies: string[] = [];
let bots: string[] = [];
let stocks: string[] = [];
export default async function MainStart() {
    await MainConnect();
    agencies = await getAllAgencies();

    if (agencies.length === 0) {
        await MainSeed();
        agencies = await getAllAgencies();
    }
    bots = await getAllBots();
    stocks = await getAllStocks();
    const job = new CronJob(`0 */${SLOT_DURATION} * * * *`, async () => {
        await MainRun({ agencies, bots, stocks });
    }, null, true, "America/New_York");
    
    console.log("Starting cron job");
    job.start();
    return {
        message: "Started cron job",
    };
}
