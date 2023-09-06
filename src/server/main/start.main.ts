import { CronJob } from "cron";
import MainRun from "./run.main";
import connectDb from "@/server/main/mongoose.main";
import { getAllAgencies } from "@/server/services/agency.service";
import { getAllBots } from "@/server/services/bot.service";
import { getAllPortfolios } from "@/server/services/portfolio.service";
import { getDate } from "@/server/services/market.service";
import { SLOT_DURATION } from "@/server/global.config";
import generateMain from "@/server/main/generator.main";
import { getAllStocks } from "../services/stock.service";

let agencies: string[] = [];
let portfolios: string[] = [];
let bots: string[] = [];
let stocks: string[] = [];
export let f = false;
let date: number = 0;
export default async function MainStart() {
    if (f) return Promise.resolve({ message: "Cron job already started" });
    await connectDb();
    f = true;
    agencies = await getAllAgencies();
    if (agencies.length === 0) {
        await generateMain();
        agencies = await getAllAgencies();
    }
    portfolios = await getAllPortfolios();
    bots = await getAllBots();
    stocks = await getAllStocks();
    date = await getDate() + 1;
    const job = new CronJob(`*/${SLOT_DURATION} * * * *`, async () => {
        console.log("Running cron job", date);
        await MainRun(agencies, portfolios, bots, stocks, date++);
    }, null, true, "America/New_York");
    job.start();
    console.log("Starting cron job");
    return {
        message: "Started cron job",
    };
}
