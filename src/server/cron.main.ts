import { CronJob } from "cron";
import taskMain from "./tasks.main";
import connectDb from "@/server/mongoose.main";
import AgencyService from "@/server/services/agency.service";
import BotService from "@/server/services/bot.service";
import CompanyService from "@/server/services/company.service";
import PortfolioService from "@/server/services/portfolio.service";
import MarketService from "./services/market.service";

let agencies: string[] = [];
let companies: string[] = [];
let portfolios: string[] = [];
let bots: string[] = [];
let date: number = 0;

const job = new CronJob("*/2 * * * *", async () => {
	console.log("Running cron job", date);
	await taskMain(agencies, companies, portfolios, bots, date++);
},null,true,"America/New_York");

export default async function cronMain() {
	await connectDb();
	agencies = await AgencyService.getAll();
	companies = await CompanyService.getAll();
	portfolios = await PortfolioService.getAll();
	bots = await BotService.getAll();
	date = await MarketService.getDate() + 1;
	console.log("Starting cron job");
	job.start();
}
