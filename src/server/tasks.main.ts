import AgencyService from "@/server/services/agency.service";
import BotService from "@/server/services/bot.service";
import CompanyService from "@/server/services/company.service";
import PortfolioService from "@/server/services/portfolio.service";
import MarketService from "@/server/services/market.service";

export default async function taskMain(
	agencies: string[],
	companies: string[],
	portfolios: string[],
	bots: string[],
	date: number
) {
	console.log(`Day ${date + 1}`);
	await Promise.all(
		agencies.map(async (agency) => {
			await AgencyService.evaluate(agency, date);
		})
	);
	console.log(`Day ${date + 1} - Agencies Evaluated`);
	await Promise.all(
		companies.map(async (company) => {
			await CompanyService.evaluate(company, date);
		})
	);
	console.log(`Day ${date + 1} - Companies Evaluated`);
	await Promise.all(
		bots.map(async (bot) => {
			await BotService.evaluate(bot, date);
		})
	);
	console.log(`Day ${date + 1} - Bots Evaluated`);
	await Promise.all(
		portfolios.map(async (portfolio) => {
			await PortfolioService.evaluate(portfolio, date);
		})
	);
	console.log(`Day ${date + 1} - Portfolios Evaluated`);
	await MarketService.evaluate(date);
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
