import connectDb from "./mongoose.main";
import AgencyGenerator from "./generators/agency.generator";
import BotGenerator from "./generators/bot.generator";
import PortfolioGenerator from "./generators/portfolio.generator";
import StockDataGenerator from "./generators/stocks.generator";

export default async function generateMain() {
    await connectDb();
    await StockDataGenerator();
    await AgencyGenerator();
    await PortfolioGenerator();
    await BotGenerator();
}
