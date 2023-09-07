import { StockInterface, StockValues } from "@/types/stock.interface";
import StockModel from "@/server/models/stock.schema";

import MarketModel from "@/server/models/market.schema";

import PortfolioInterface from "@/types/portfolio.interface";
import PortfolioModel from "@/server/models/portfolio.schema";

import { DATE_LIMIT } from "@/server/global.config";


export const getMarket = async () => {
    return await MarketModel.find({}).sort({ date: -1 }).exec();
};

export const getTimeline = async () => {
    return await MarketModel.find().exec();
};

export const getRelativeCumulativeMarketCapitalization = async () => {
    const [Market, prevMarket] = await MarketModel.find({}).sort({ date: -1 }).limit(2).exec();
    if (!prevMarket) return 0;
    return ((Market.cumulative_market_capitalization - prevMarket.cumulative_market_capitalization) / prevMarket.cumulative_market_capitalization);
};

export const getRelativeCumulativeNetWorth = async () => {
    const [Market, prevMarket] = await MarketModel.find({}).sort({ date: -1 }).limit(2).exec();
    if (!prevMarket) return 0;
    return ((Market.cumulative_net_worth - prevMarket.cumulative_net_worth) / prevMarket.cumulative_net_worth);
};

export const getDate = async () => {
    const [Market] = await MarketModel.find({}, { date: 1 }).sort({ date: -1 }).limit(1).exec();
    if (!Market) return -1;
    return Market.date;
};

const analyzeTrendingStocks = async () => {
    const stocks = await StockModel.find({}, { _id: 1, slope: 1 }).exec() as StockValues[];
    stocks.sort((a, b) => b.slope - a.slope);

    return stocks.map((stock) => stock._id);
};

const analyzePredictedStocks = async () => {
    var stocks = await StockModel.find({}, { _id: 1, slope: 1 }).exec() as StockValues[];
    stocks = stocks.filter((stock) => stock.slope > 0);
    stocks.sort((a, b) => b.double_slope - a.double_slope);

    return stocks.map((stock) => stock._id);
}

export const evaluateMarket = async (new_date: number) => {
    await MarketModel.deleteMany({ date: { $lte: new_date - DATE_LIMIT }, }).exec();
    const stocks: StockInterface[] = await StockModel.find({}, { timeline: 1 }).exec();
    const market_caps = stocks.map((stock) => stock.timeline[stock.timeline.length - 1].price);
    const cumulative_market_capitalization = market_caps.reduce((a, b) => a + b, 0);

    const portfolios: PortfolioInterface[] = await PortfolioModel.find({}, { netWorth: 1 }).exec();

    const net_worths = portfolios.map((portfolio) => portfolio.timeline[portfolio.timeline.length - 1].value);
    const cumulative_net_worth = net_worths.reduce((a, b) => a + b, 0);

    const trending_stocks = await analyzeTrendingStocks();
    const predicted_stocks = await analyzePredictedStocks();

    const new_market = new MarketModel({
        date: new_date,
        cumulative_market_capitalization,
        cumulative_net_worth,
        trending_stocks,
        predicted_stocks,
    });

    await new_market.save();
};
export const getTrendingStocks = async (count?: number) => {
    const [Market] = await MarketModel.find({}, { trending_stocks: 1 }).sort({ date: -1 }).limit(1).exec();
    if (!Market) return [];
    if (count) return Market.trending_stocks.slice(0, count);
    return Market.trending_stocks;
};

export const getPredictedStocks = async (count?: number) => {
    const [Market] = await MarketModel.find({}, { predicted_stocks: 1 }).sort({ date: -1 }).limit(1).exec();
    if (!Market) return [];
    if (count) return Market.predicted_stocks.slice(0, count);
    return Market.predicted_stocks;
};
export const getHighSlopeStocks = async (count?: number) => {
};

