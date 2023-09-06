import StockModel from "@/server/models/stock.schema";
import {
    ValuePoint,
    createStockDto,
    StockInterface,
    StockInterfaceWithId,
    StockValues,
} from "@/types/stock.interface";
import { DATE_LIMIT } from "@/server/global.config";
import { getPortfolioById } from "./portfolio.service";

export const addStock = async (stock: createStockDto) => {
    const newStock = {
        ...stock,
        issued: new Date(),
        traders: [],
    } as StockInterface;
    const newStockDoc = await new StockModel({ ...newStock }).save();
    return newStockDoc;
};

export const getAllStocks = async (): Promise<string[]> => {
    const data = await StockModel.find({}, { _id: 1 }).exec();
    return data.map((stock) => String(stock._id));
};

export const getStockById = async (_id: string): Promise<StockInterfaceWithId> => {
    const data = await StockModel.findById(_id).exec();
    return {
        ...data._doc,
        price: data.timeline[data.timeline.length - 1].price,
        slope: data.slope,
        double_slope: data.double_slope,
        fall_since_peak: data.fall_since_peak,
        rise_since_trough: data.rise_since_trough,
    };
};

export const getStockBasicInfo = async (_id: string) => {
    const data = await StockModel.findById(_id).exec() as StockInterfaceWithId;
    return {
        _id: data._id,
        price: data.timeline[data.timeline.length - 1].price,
        symbol: data.symbol,
        company: data.company.name,
    };
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

export const addStockValuePoint = async (_id: string, valuePoint: ValuePoint) => {
    const stock: StockInterfaceWithId = await StockModel.findById(_id).exec();
    if (!stock) return null;
    stock.timeline.push({ ...valuePoint });
    return await StockModel.findByIdAndUpdate(_id, { timeline: stock.timeline }, { new: true }).exec();
};

export const getRandomStocks = async (count: number) => {
    const stocks = await StockModel.find({}, { _id: 1 }).limit(count).exec();
    return stocks.map((stock) => stock._id);
};

export const getHighSlopeStocks = async (count?: number) => {
    const stocks = await StockModel.find({}, { _id: 1, slope: 1 }).exec() as StockValues[];
    stocks.sort((a, b) => b.slope - a.slope);
    
    if (!count) return stocks.map((stock) => stock._id);
    return stocks.slice(0, count).map((stock) => stock._id);
};

export const getHighDoubleSlopeStocks = async (count?: number) => {
    var stocks = await StockModel.find({}, { _id: 1, slope: 1 }).exec() as StockValues[];
    stocks = stocks.filter((stock) => stock.slope > 0);
    stocks.sort((a, b) => b.double_slope - a.double_slope);

    if (!count) return stocks.map((stock) => stock._id);
    return stocks.slice(0, count).map((stock) => stock._id);
};

export const evaluateStock = async (_id: string, date: number) => {
    const { traders, timeline } = await StockModel.findById(_id, { traders: 1 }).exec() as StockInterfaceWithId;
    var volume = 0;
    const new_traders = [] as string[];
    await Promise.all(
        traders.map(async (trader) => {
            const portfolio = await getPortfolioById(trader);
            if (portfolio) {
                const investment = portfolio.investments.find((investment) => investment.stock == _id);
                if (investment) {
                    volume += investment.quantity;
                    new_traders.push(trader);
                }
            }
        })
    );

    const new_timeline = timeline.filter((point) => point.date >= date - DATE_LIMIT);
    new_timeline[timeline.length - 1].volume = volume;
    await StockModel.findByIdAndUpdate(_id, { timeline: new_timeline, traders: new_traders }, { new: true }).exec();

};