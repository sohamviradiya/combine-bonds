
import MarketInterface from "@/types/market.interface";
import MarketModel from "@/server/models/market.schema";

import { getAllStocks, getStockAnalytics, getStockById } from "./stock.service";

import { getPortfolioTimelines } from "./portfolio.service";

import { DATE_LIMIT, DEFAULT_MARKET_SENTIENCE_INDEX } from "@/server/global.config";
import { StockValues } from "@/types/stock.interface";


export const getMarket = async () => {
    const [Market] = await MarketModel.find({}).sort({ date: -1 }).limit(1).exec();
    return Market as MarketInterface;
};

export const getMarketAnalytics = async () => {
    const [Market, prevMarket] = await MarketModel.find({}).sort({ date: -1 }).limit(2).exec();
    if (!prevMarket) return {
        relative_cumulative_market_capitalization: 0,
        relative_cumulative_net_worth: 0,
        market_sentience_index: Market.market_sentience_index,
        market_index_change: 0,
    };

    const relative_cumulative_market_capitalization = ((Market.cumulative_market_capitalization - prevMarket.cumulative_market_capitalization) / prevMarket.cumulative_market_capitalization);
    const relative_cumulative_net_worth = ((Market.cumulative_net_worth - prevMarket.cumulative_net_worth) / prevMarket.cumulative_net_worth);
    return {
        relative_cumulative_market_capitalization,
        relative_cumulative_net_worth,
        market_sentience_index: Market.market_sentience_index,
        market_index_change: Market.market_sentience_index - prevMarket.market_sentience_index,
    };
};

export const getMarketTimeline = async () => {
    return await MarketModel.find({}, { date: 1, cumulative_market_capitalization: 1, cumulative_net_worth: 1, market_sentience_index: 1 }).sort({ date: 1 }).exec();
};

export const getDate = async () => {
    const [Market]: MarketInterface[] = await MarketModel.find({}, { date: 1 }).sort({ date: -1 }).limit(1).exec();
    return Market?.date || -1;
};

const analyzeTrendingStocks = async () => {
    const stock_ids = await getAllStocks();
    const all_stocks = await Promise.all(stock_ids.map(async (stock_id) => {
        return await getStockById(stock_id);
    })) as StockValues[];
    const filtered_stocks = all_stocks.filter((stock) => stock.slope > 0);
    filtered_stocks.sort((a, b) => b.slope - a.slope);
    return filtered_stocks.map((stock) => stock._id);
};

const analyzePredictedStocks = async () => {
    const stock_ids = await getAllStocks();
    const all_stocks = await Promise.all(stock_ids.map(async (stock_id) => {
        return await getStockById(stock_id);
    })) as StockValues[];
    const filtered_stocks = all_stocks.filter((stock) => stock.slope > 0);
    filtered_stocks.sort((a, b) => b.double_slope - a.double_slope);
    return filtered_stocks.map((stock) => stock._id);
}

export const evaluateMarket = async (new_date?: number) => {
    if (!new_date) new_date = 0;
    const stocks = await getAllStocks();
    const market_caps = await Promise.all(stocks.map(async (stock_id) => {
        const stock = await getStockAnalytics(stock_id);
        return stock.market_valuation;
    }));

    const cumulative_market_capitalization = market_caps.reduce((a, b) => a + b, 0);

    const portfolios = await getPortfolioTimelines();

    const net_worths = portfolios.map((portfolio) => portfolio.timeline[portfolio.timeline.length - 1].value);
    const cumulative_net_worth = net_worths.reduce((a, b) => a + b, 0);

    const trending_stocks = await analyzeTrendingStocks();
    const predicted_stocks = await analyzePredictedStocks();

    const [prevMarket] = await MarketModel.find({}).sort({ date: -1 }).limit(1).exec() as MarketInterface[];
    var market_sentience_index = DEFAULT_MARKET_SENTIENCE_INDEX;
    if (prevMarket?.market_sentience_index) {
        market_sentience_index = prevMarket.market_sentience_index;
        market_sentience_index *= (cumulative_market_capitalization / prevMarket.cumulative_market_capitalization + cumulative_net_worth / prevMarket.cumulative_net_worth) / 2;
    }


    await MarketModel.deleteMany({ date: { $lte: new_date - DATE_LIMIT }, }).exec();

    const new_market = new MarketModel({
        date: new_date,
        cumulative_market_capitalization,
        cumulative_net_worth,
        market_sentience_index,
        trending_stocks,
        predicted_stocks,
    })

    await new_market.save();
};

export const getTrendingStocks = async (count?: number) => {
    const [Market]: MarketInterface[] = await MarketModel.find({}, { trending_stocks: 1 }).sort({ date: -1 }).limit(1).exec();
    if (!Market) return [];
    if (count) return Market.trending_stocks.slice(0, count);
    return Market.trending_stocks;
};

export const getPredictedStocks = async (count?: number) => {
    const [Market]: MarketInterface[] = await MarketModel.find({}, { predicted_stocks: 1 }).sort({ date: -1 }).limit(1).exec();
    if (!Market) return [];
    if (count) return Market.predicted_stocks.slice(0, count);
    return Market.predicted_stocks;
};

