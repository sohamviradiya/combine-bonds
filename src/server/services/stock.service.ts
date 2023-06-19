import StockModel from "@/server/models/stock.schema";
import {
	ValuePoint,
	createStockDto,
	StockInterface,
	StockInterfaceWithID,
	StockValues,
	DIVIDEND_FACTOR,
} from "@/server/types/stock.interface";
import CompanyModel from "@/server/models/company.schema";
import { DATE_LIMIT } from "@/server/types/market.interface";
const StockService = (() => {
	const add = async (stock: createStockDto) => {
		const newStock = {
			...stock,
			createdAt: new Date(),
			traders: [],
		} as StockInterface;
		const newStockDoc = await new StockModel({ ...newStock }).save();
		await CompanyModel.findByIdAndUpdate(stock.company, {
			$push: {
				stocks: {
					ref: newStockDoc._id,
					class: stock.class,
				},
			},
		}).exec();
		return newStockDoc;
	};
	const getAll = async (): Promise<string[]> => {
		const data = await StockModel.find({}, { _id: 1 }).exec();
		return data.map((stock) => String(stock._id));
	};

	const get = async (_id: string): Promise<StockInterfaceWithID> => {
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

	const getValue = async (_id: string): Promise<StockValues> => {
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

	const addPoint = async (_id: string, valuePoint: ValuePoint) => {
		const stock: StockInterfaceWithID = await StockModel.findById(_id).exec();
		if (!stock) return null;
		stock.timeline = stock.timeline.filter(
			(point) => point.date >= valuePoint.date - DATE_LIMIT
		);
		stock.timeline.push({ ...valuePoint });
		return await StockModel.findByIdAndUpdate(_id, {
			timeline: stock.timeline,
		}).exec();
	};

	const getRandom = async (count: number) => {
		const stocks = await StockModel.find({}, { _id: 1 }).limit(count).exec();
		return stocks.map((stock) => stock._id);
	};

	const getHighSlope = async (count: number) => {
		const stocks = await getAllValues();
		stocks.sort((a, b) => b.slope - a.slope);
		return stocks.slice(0, count).map((stock) => stock._id);
	};

	const getHighDoubleSlope = async (count: number) => {
		const stocks = (await getAllValues()).filter((stock) => stock.slope > 0);
		stocks.sort((a, b) => b.double_slope - a.double_slope);

		return stocks.slice(0, count).map((stock) => stock._id);
	};

	return {
		add,
		getAll,
		get,
		getValue,
		addPoint,
		getRandom,
		getHighSlope,
		getHighDoubleSlope,
	};
})();
export default StockService;
