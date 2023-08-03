import StockModel from "@/server/models/stock.schema";
import {
    ValuePoint,
    createStockDto,
    StockInterface,
    StockInterfaceWithId,
    StockValues,
} from "types/stock.interface";
import { DATE_LIMIT } from "@/server/global.config";

const addStock = async (stock: createStockDto) => {
    const newStock = {
        ...stock,
        createdAt: new Date(),
        traders: [],
    } as StockInterface;
    const newStockDoc = await new StockModel({ ...newStock }).save();
    return newStockDoc;
};

const getAllStocks = async (): Promise<string[]> => {
    const data = await StockModel.find({}, { _id: 1 }).exec();
    return data.map((stock) => String(stock._id));
};

const getStockById = async (_id: string): Promise<StockInterfaceWithId> => {
    const data = await StockModel.findById(_id).exec();
    return {
        ...data._doc,
        price: data.price,
        slope: data.slope,
        double_slope: data.double_slope,
        fall_since_peak: data.fall_since_peak,
        rise_since_trough: data.rise_since_trough,
    };
};

const getStockValue = async (_id: string): Promise<StockValues> => {
    const data = await StockModel.findById(_id).exec();
    return {
        _id: data._id,
        price: data.price,
        slope: data.slope,
        double_slope: data.double_slope,
        fall_since_peak: data.fall_since_peak,
        rise_since_trough: data.rise_since_trough,
        last_value_point: data.timeline[data.timeline.length - 1],
    };
};

const getAllValues = async (): Promise<StockValues[]> => {
    const data = await StockModel.find().exec();
    return data.map((stock: any) => ({
        _id: stock._id,
        price: stock.price,
        slope: stock.slope,
        double_slope: stock.double_slope,
        fall_since_peak: stock.fall_since_peak,
        rise_since_trough: stock.rise_since_trough,
        last_value_point: stock.timeline[stock.timeline.length - 1],
    }));
};

const addStockValuePoint = async (_id: string, valuePoint: ValuePoint) => {
    const stock: StockInterfaceWithId = await StockModel.findById(_id).exec();
    if (!stock) return null;
    stock.timeline = stock.timeline.filter(
        (point) => point.date >= valuePoint.date - DATE_LIMIT
    );
    stock.timeline.push({ ...valuePoint });
    return await StockModel.findByIdAndUpdate(_id, {
        timeline: stock.timeline,
    }).exec();
};

const getRandomStocks = async (count: number) => {
    const stocks = await StockModel.find({}, { _id: 1 }).limit(count).exec();
    return stocks.map((stock) => stock._id);
};

const getHighSlopeStocks = async (count: number) => {
    const stocks = await getAllValues();
    stocks.sort((a, b) => b.slope - a.slope);
    return stocks.slice(0, count).map((stock) => stock._id);
};

const getHighDoubleSlopeStocks = async (count: number) => {
    const stocks = (await getAllValues()).filter((stock) => stock.slope > 0);
    stocks.sort((a, b) => b.double_slope - a.double_slope);

    return stocks.slice(0, count).map((stock) => stock._id);
};

export {
    addStock,
    getAllStocks,
    getStockById,
    getStockValue,
    addStockValuePoint,
    getRandomStocks,
    getHighSlopeStocks,
    getHighDoubleSlopeStocks,
};
