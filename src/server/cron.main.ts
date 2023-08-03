import { CronJob } from "cron";
import taskMain from "./tasks.main";
import connectDb from "@/server/mongoose.main";
import { getAllAgencies } from "@/server/services/agency.service";
import { getAllBots } from "@/server/services/bot.service";
import { getAllPortfolios } from "@/server/services/portfolio.service";
import { getDate } from "@/server/services/market.service";
import { SLOT_DURATION } from "@/server/global.config";

let agencies: string[] = [];
let portfolios: string[] = [];
let bots: string[] = [];
export let f = false;
let date: number = 0;
export default async function cronMain() {
    if (f) return Promise.resolve({ message: "Cron job already started" });
    await connectDb();
    f = true;
    agencies = await getAllAgencies();
    portfolios = await getAllPortfolios();
    bots = await getAllBots();
    date = await getDate() + 1;
    const job = new CronJob(
        `*/${SLOT_DURATION} * * * *`,
        async () => {
            console.log("Running cron job", date);
            await taskMain(agencies, portfolios, bots, date++);
        },
        null,
        true,
        "America/New_York"
    );
    job.start();
    console.log("Starting cron job");
    return {
        message: "Started cron job",
    };
}
