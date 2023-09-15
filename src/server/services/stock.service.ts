import { ValuePoint, createStockDto, StockInterface, StockInterfaceWithId, StockValues } from "@/types/stock.interface";

import StockModel from "@/server/models/stock.schema";

import { getPortfolioById } from "@/server/services/portfolio.service";

import { DATE_LIMIT } from "@/server/global.config";

export const addStock = async (stock: createStockDto) => {
    const newStockDoc = await new StockModel({
        ...stock,
        issued: new Date(),
        traders: [],
    } as StockInterface).save();
    return newStockDoc;
};

export const getAllStocks = async () => {
    const data = await StockModel.find({}, { _id: 1 }).exec();
    return data.map((stock) => String(stock._id));
};

export const getStockDataById = async (_id: string) => {
    const data = await StockModel.findById(_id).exec() as StockInterfaceWithId & StockValues;
    const timeline = data.timeline.map((point) => {
        return {
            date: point.date,
            price: point.price,
            dividend: point.dividend,
            volume: point.volume,
        }
    });
    return {
        _id: String(data._id),
        company: { ...data.company },
        symbol: data.symbol,
        issued: data.issued,
        market_valuation: data.market_valuation,
        slope: data.slope,
        gross_volume: data.gross_volume,
        double_slope: data.double_slope,
        fall_since_peak: data.fall_since_peak,
        rise_since_trough: data.rise_since_trough,
        timeline: timeline,
        last_value_point: timeline[timeline.length - 1],
        traders: data.traders.map((trader) => String(trader)),
    }
};

export const getStockBasicInfo = async (_id: string) => {
    const data = await StockModel.findById(_id).exec() as StockInterfaceWithId & StockValues;
    return {
        _id: String(data._id),
        price: data.timeline[data.timeline.length - 1].price,
        symbol: data.symbol,
        company: data.company.name,
        slope: data.slope,
    };
};

export const getStocksByQuery = async (query: string, page: number = 0, limit: number = 8) => {
    const data = await StockModel.find({
        "company.name": {
            $regex: `(.)*${query}(.)*`,
        }
    }, { _id: 1 }).skip((page) * limit).limit(limit).exec();
    return data.map((stock) => String(stock._id));
};


export const getStockAnalytics = async (_id: string) => {
    const data = await StockModel.findById(_id).exec() as StockValues;
    return {
        dividend: data.timeline[data.timeline.length - 1].dividend,
        price: data.timeline[data.timeline.length - 1].price,
        fall_since_peak: data.fall_since_peak,
        rise_since_trough: data.rise_since_trough,
        market_valuation: data.market_valuation,
        slope: data.slope,
        double_slope: data.double_slope,
    };
};

export const addStockValuePoint = async (_id: string, valuePoint: Omit<ValuePoint, "date">) => {
    const stock = await StockModel.findById(_id).exec() as StockInterfaceWithId;
    const timeline = stock.timeline;
    timeline.sort((a, b) => a.date - b.date);
    const date = timeline[timeline.length - 1].date + 1;
    timeline.push({
        ...valuePoint,
        date,
    });
    await StockModel.findByIdAndUpdate(_id, { timeline }, { new: true }).exec();
};

export const getRandomStocks = async (count: number) => {
    const stocks = await getAllStocks();
    const random_stocks = [] as string[];
    for (let i = 0; i < count; i++)  {
        var random_stock = stocks[Math.floor(Math.random() * stocks.length)];
        while (random_stocks.includes(random_stock))  {
            random_stock = stocks[Math.floor(Math.random() * stocks.length)];
        }
    }
    return random_stocks;
};

export const evaluateStock = async (_id: string) => {
    const { traders, timeline } = await StockModel.findById(_id, { traders: 1, timeline: 1 }).exec() as StockInterfaceWithId;
    var volume = 0;
    timeline.sort((a, b) => a.date - b.date);
    const date = timeline[timeline.length - 1].date + 1;
    const new_traders = [] as string[];
    await Promise.all(
        traders.map(async (trader) => {
            const portfolio = await getPortfolioById(trader);
            const investment = portfolio.investments.find((investment) => investment.stock == _id);
            if (investment) {
                volume += investment.quantity;
                new_traders.push(trader);
            }
        })
    );

    const new_timeline = timeline.filter((point) => point.date >= date - DATE_LIMIT);
    new_timeline.sort((a, b) => a.date - b.date);

    new_timeline[new_timeline.length - 1].volume = volume;
    await StockModel.findByIdAndUpdate(_id, { timeline: new_timeline, traders: new_traders }, { new: true }).exec();

};

export const pullTrader = async (_id: string, portfolio_id: string) => {
    await StockModel.findByIdAndUpdate(_id, {
        $pull: { traders: String(portfolio_id) },
    }).exec();
};

export const pushTrader = async (_id: string, portfolio_id: string) => {
    await StockModel.findByIdAndUpdate(_id, {
        $push: { traders: String(portfolio_id) },
    }).exec();
};

export const getStockTimelines = async (): Promise<{ timeline: ValuePoint[]; }[]> => {
    return await StockModel.find({}, { timeline: 1 }).exec();
}

