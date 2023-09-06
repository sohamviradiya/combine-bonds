import AgencyGenerator from "@/server/generators/agency.generator";
import BotGenerator from "@/server/generators/bot.generator";
import PortfolioGenerator from "@/server/generators/portfolio.generator";
import StockGenerator from "@/server/generators/stock.generator";

export default async function generateMain() {
    await StockGenerator();
    await AgencyGenerator();
    await PortfolioGenerator();
    await BotGenerator();
}
