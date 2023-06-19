import AgencyGenerator from "../generators/agency.generator";
import BotGenerator from "../generators/bot.generator";
import CompanyGenerator from "../generators/company.generator";
import PortfolioGenerator from "../generators/portfolio.generator";
import StockGenerator from "../generators/stocks.generator";
import connectDb from "../mongoose.main";
import AgencyService from "../services/agency.service";
import BotService from "../services/bot.service";
import CompanyService from "../services/company.service";
import PortfolioService from "../services/portfolio.service";
import StockService from "../services/stock.service";
import MarketService from "../services/market.service";

const SIMULATION_DURATION = 50;

export default async function invokeMain() {
	await connectDb();
	await CompanyGenerator();
	await StockGenerator();
	await AgencyGenerator();
	await PortfolioGenerator();
	await BotGenerator();
	const agencies = await AgencyService.getAll();
	const companies = await CompanyService.getAll();
	const portfolios = await PortfolioService.getAll();
	const bots = await BotService.getAll();
	for (let i = 0; i < SIMULATION_DURATION; i++) {
		console.log(`Day ${i + 1}`);
		await Promise.all(
			agencies.map(async (agency) => {
				await AgencyService.evaluate(agency, i);
			})
		);
		console.log(`Day ${i + 1} - Agencies Evaluated`);
		await Promise.all(
			companies.map(async (company) => {
				await CompanyService.evaluate(company, i);
			})
		);
		console.log(`Day ${i + 1} - Companies Evaluated`);
		await Promise.all(
			bots.map(async (bot) => {
				await BotService.evaluate(bot, i);
			})
		);
		console.log(`Day ${i + 1} - Bots Evaluated`);
		await Promise.all(
			portfolios.map(async (portfolio) => {
				await PortfolioService.evaluate(portfolio, i);
			})
		);
		console.log(`Day ${i + 1} - Portfolios Evaluated`);
		await MarketService.evaluate(i);
		console.log(
			`Relative Net Worth Change: ${
				(await MarketService.getRelativeCumulativeNetWorth()) * 100
			} %`
		);
		console.log(
			`Relative Market Cap Change: ${
				(await MarketService.getRelativeCumulativeMarketCapitalization()) * 100
			} %`
		);
	}
}
