import AgencyGenerator from "@/server/seeds/agency.seed";
import BotGenerator from "@/server/seeds/bot.seed";
import PortfolioGenerator from "@/server/seeds/portfolio.seed";
import StockGenerator from "@/server/seeds/stock.seed";
import { evaluateMarket } from "../services/market.service";

export default async function seedMain() {
    await StockGenerator();
    await AgencyGenerator();
    await PortfolioGenerator();
    await BotGenerator();
    await evaluateMarket();
}
