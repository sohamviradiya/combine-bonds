import connectDb from "./mongoose.main";
import AgencyGenerator from "./generators/agency.generator";
import BotGenerator from "./generators/bot.generator";
import CompanyGenerator from "./generators/company.generator";
import PortfolioGenerator from "./generators/portfolio.generator";
import StockGenerator from "./generators/stocks.generator";

export default async function generateMain() {
	await connectDb();
	await CompanyGenerator();
	await StockGenerator();
	await AgencyGenerator();
	await PortfolioGenerator();
	await BotGenerator();
}
