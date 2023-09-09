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
let portfolios: string[] = [];
let bots: string[] = [];
let stocks: string[] = [];
let date: number = 0;
export default async function MainStart() {
    await MainConnect();
    agencies = await getAllAgencies();

    if (agencies.length === 0) {
        await MainSeed();
        date = 0;
        agencies = await getAllAgencies();
    }
    else
        date = await getDate() + 1;
    portfolios = await getAllPortfolios();
    bots = await getAllBots();
    stocks = await getAllStocks();
    const job = new CronJob(`*/${SLOT_DURATION} * * * *`, async () => {
        console.log("Running cron job", date);
        await MainRun({ agencies, portfolios, bots, stocks, date });
        date++;
    }, null, true, "America/New_York");
    job.start();
    console.log("Starting cron job");
    return {
        message: "Started cron job",
    };
}
