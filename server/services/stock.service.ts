import StockModel from "server/models/stock.schema";
import { ValuePoint, createStockDto, StockInterface, StockInterfaceWithID, StockValues } from "server/types/stock.interface";
import CompanyModel from "server/models/company.schema";
import { DATE_LIMIT } from "server/types/market.interface";
const StockService = (() => {
	const add = async (stock: createStockDto) => {
		const newStock = { ...stock, createdAt: new Date(), traders: [] } as StockInterface;
		const newStockDoc = await new StockModel({ ...newStock }).save();
		await CompanyModel.findByIdAndUpdate(stock.company, { $push: { stocks: newStockDoc._id } }).exec();
		return newStockDoc;
	};
	const getAll = async () => {
		const data = await StockModel.find({}, { _id: 1 }).exec();
		return data.map((stock) => stock._id);
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

	const getValue = async (_id: string) => {
		const data = await StockModel.findById(_id).exec();
		return {
			price: data.price,
			slope: data.slope,
			double_slope: data.double_slope,
			fall_since_peak: data.fall_since_peak,
			rise_since_trough: data.rise_since_trough,
		};
	};

	const getAllValues = async () : Promise<StockValues[]> => {
		const data = await StockModel.find().exec();
		return data.map((stock: any) => ({
			_id: stock._id,
			price: stock.price,
			slope: stock.slope,
			double_slope: stock.double_slope,
			fall_since_peak: stock.fall_since_peak,
			rise_since_trough: stock.rise_since_trough,
		}));
	};

	const changeVolume = async (_id: string, change: number) => {
		const stock: StockInterfaceWithID = await StockModel.findById(_id).exec();
		if (!stock) return null;
		stock.timeline[stock.timeline.length - 1].volume_in_market += change;
		return StockModel.findByIdAndUpdate(_id, stock).exec();
	};

	const getMarketCap = async (_id: string) => {
		const { timeline }: { timeline: Array<ValuePoint> } = await StockModel.findById(_id, { timeline: 1 }).exec();
		return timeline[timeline.length - 1].market_valuation;
	};

	const addPoint = async (_id: string, valuePoint: ValuePoint) => {
		const stock: StockInterfaceWithID = await StockModel.findById(_id).exec();
		if (!stock) return null;
		const new_date = stock.timeline[stock.timeline.length - 1].date + 1;
		stock.timeline = stock.timeline.filter((point) => point.date > new_date - DATE_LIMIT);
		stock.timeline.push({ ...valuePoint, date: new_date });
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
		changeVolume,
		add,
		getAll,
		get, 
		getValue,
		addPoint,
		getMarketCap,
		getRandom,
		getHighSlope,
		getHighDoubleSlope,
	};
})();
export default StockService;
