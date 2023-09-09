import { ValuePoint, createStockDto, StockInterface, StockInterfaceWithId, StockValues } from "@/types/stock.interface";

import StockModel from "@/server/models/stock.schema";

import { getPortfolioById } from "@/server/services/portfolio.service";

import { DATE_LIMIT } from "@/server/global.config";

export async function addStock(stock: createStockDto) {
    const newStockDoc = await new StockModel({
        ...stock,
        issued: new Date(),
        traders: [],
    } as StockInterface).save();
    return newStockDoc;
};

export async function getAllStocks() {
    const data = await StockModel.find({}, { _id: 1 }).exec();
    return data.map((stock) => String(stock._id));
};

export async function getStockDataById(_id: string) {
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
    }
};

export async function getStockBasicInfo(_id: string) {
    const data = await StockModel.findById(_id).exec() as StockInterfaceWithId & StockValues;
    return {
        _id: String(data._id),
        price: data.timeline[data.timeline.length - 1].price,
        symbol: data.symbol,
        company: data.company.name,
        slope: data.slope,
    };
};

export async function getStocksByQuery(query: string, page: number) {
    const data = await StockModel.find({ $text: { $search: query } }, { score: { $meta: "textScore" }, _id: 1 }).sort({ score: { $meta: "textScore" } }).skip((page - 1) * 6).limit(6).exec();
    return data.map((stock) => String(stock._id));
};


export async function getStockAnalytics(_id: string) {
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

export async function addStockValuePoint(_id: string, valuePoint: ValuePoint) {
    return await StockModel.findByIdAndUpdate(_id, { $push: { timeline: { ...valuePoint } } }, { new: true }).exec();
};

export async function getRandomStocks(count: number) {
    const stocks = await getAllStocks();
    const random_stocks = [] as string[];
    for (let i = 0; i < count; i++) {
        var random_stock = stocks[Math.floor(Math.random() * stocks.length)];
        while (random_stocks.includes(random_stock)) {
            random_stock = stocks[Math.floor(Math.random() * stocks.length)];
        }
    }
    return random_stocks;
};

export async function evaluateStock(_id: string, date: number) {
    const { traders, timeline } = await StockModel.findById(_id, { traders: 1, timeline: 1 }).exec() as StockInterfaceWithId;
    var volume = 0;
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

export async function pullTrader(_id: string, portfolio_id: string) {
    await StockModel.findByIdAndUpdate(_id, {
        $pull: { traders: String(portfolio_id) },
    }).exec();
};

export async function pushTrader(_id: string, portfolio_id: string) {
    await StockModel.findByIdAndUpdate(_id, {
        $push: { traders: String(portfolio_id) },
    }).exec();
};

export async function getStockTimelines(): Promise<{ timeline: ValuePoint[]; }[]> {
    return await StockModel.find({}, { timeline: 1 }).exec();
}

