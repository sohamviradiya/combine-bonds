import AgencyGenerator from "@/server/seeds/agency.seed";
import BotGenerator from "@/server/seeds/bot.seed";
import PortfolioGenerator from "@/server/seeds/portfolio.seed";
import StockGenerator from "@/server/seeds/stock.seed";

export default async function generateMain() {
    await StockGenerator();
    await AgencyGenerator();
    await PortfolioGenerator();
    await BotGenerator();
}
