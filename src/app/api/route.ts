import { NextResponse } from "next/server";
import AgencyGenerator from "server/generators/agency.generator";
import BotGenerator from "server/generators/bot.generator";
import CompanyGenerator from "server/generators/company.generator";
import PortfolioGenerator from "server/generators/portfolio.generator";
import StockGenerator from "server/generators/stocks.generator";
import connectDb from "server/mongoose.main";
import AgencyService from "server/services/agency.service";
import BotService from "server/services/bot.service";
import MarketService from "server/services/market.service";
import PortfolioService from "server/services/portfolio.service";
import StockService from "server/services/stock.service";
let k = 0;
export async function GET() {
	await connectDb();

	await CompanyGenerator();
	await StockGenerator();
	await AgencyGenerator();
	await PortfolioGenerator();
	await BotGenerator();
	const agencies = await AgencyService.getAll();
	const bots = await BotService.getAll();
	const portfolios = await PortfolioService.getAll();
	for (let i = 0; i < 30; i++) {
		k++;console.log("Day", i);
		await MarketService.evaluate(k);
		console.log("Day", i, "Market Evaluated");
		await Promise.all(agencies.map(async (agency) => await AgencyService.evaluate(agency)));
		console.log("Day", i, "Agencies Evaluated");
		await Promise.all(bots.map(async (bot) => await BotService.evaluate(bot)));
		console.log("Day", i, "Bots Evaluated");
		await Promise.all(portfolios.map(async (portfolio) => await PortfolioService.evaluate(portfolio)));
		console.log("Day", i, "Portfolios Evaluated");
		console.log("Relative Net Worth Change", await MarketService.getRelativeCumulativeNetWorth());
		console.log("Relative Market Cap Change", await MarketService.getRelativeCumulativeMarketCapitalization());
	}
}
