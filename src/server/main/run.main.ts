import { evaluateAgencies } from "@/server/services/agency.service";
import { evaluateBot } from "@/server/services/bot.service";
import { evaluatePortfolio, getAllPortfolios } from "@/server/services/portfolio.service";
import { evaluateMarket, getMarketAnalytics, } from "@/server/services/market.service";
import { evaluateStock } from "@/server/services/stock.service";

export default async function MainRun({ agencies, bots, stocks, date }: {
    agencies: string[],
    bots: string[],
    stocks: string[],
    date: number
}
) {
    const portfolios = await getAllPortfolios();
    console.log(`Day ${date + 1}`);
    await Promise.all(
        agencies.map(async (agency) => {
            await evaluateAgencies(agency, date);
        })
    );
    console.log(`Day ${date + 1} - Agencies Evaluated`);

    await Promise.all(
        bots.map(async (bot) => {
            await evaluateBot(bot, date);
        })
    );
    console.log(`Day ${date + 1} - Bots Evaluated`);

    await Promise.all(
        portfolios.map(async (portfolio) => {
            await evaluatePortfolio(portfolio, date);
        })
    );
    console.log(`Day ${date + 1} - Portfolios Evaluated`);

    await Promise.all(
        stocks.map(async (stock) => {
            await evaluateStock(stock, date);
        })
    );
    console.log(`Day ${date + 1} - Stocks Evaluated`);

    await evaluateMarket(date);
    console.log(`Day ${date + 1} - Market Evaluated`);
    const analytics = await getMarketAnalytics();
    console.log(`Day ${date + 1} - ${JSON.stringify(analytics)}`);
}
