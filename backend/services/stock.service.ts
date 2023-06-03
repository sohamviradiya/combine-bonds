import StockModel from "backend/models/stock.schema";
import {
	ValuePoint,
	createStockDto,
	STOCK_CLASS,
	StockInterface,
	StockInterfaceWithID,
} from "backend/interfaces/stock.interface";
import CompanyModel from "backend/models/company.schema";
const StockService = (() => {
	const addStock = async (stock: createStockDto) => {
		const newStock = { ...stock, createdAt: new Date() } as StockInterface;
		const newStockDoc = await new StockModel({ ...newStock }).save();
		await CompanyModel.findByIdAndUpdate(stock.company, { $push: { stocks: newStockDoc._id } }).exec();
		return newStockDoc;
	};
	const getStocks = async () => {
		const data = await StockModel.find().exec();
		return data.map(
			(stock): StockInterfaceWithID => ({
				...stock._doc,
				price: stock.price,
				slope: stock.slope,
				double_slope: stock.double_slope,
			})
		);
	};
	const getStock = async (_id: string): Promise<StockInterfaceWithID> => {
		const data = await StockModel.findById(_id).exec();
		return { ...data._doc, price: data.price, slope: data.slope, double_slope: data.double_slope };
	};
	const changeVolume = async (_id: string, change: number) => {
		const stock: StockInterfaceWithID = await StockModel.findById(_id).exec();
		if (!stock) return null;
		stock.timeline[stock.timeline.length - 1].volume_in_market += change;
		return StockModel.findByIdAndUpdate(_id, stock).exec();
	};
	const addPoint = async (_id: string, valuePoint: ValuePoint) => {
		const stock: StockInterfaceWithID = await StockModel.findById(_id).exec();
		if (!stock) return null;
		stock.timeline = stock.timeline.filter((point) => point.date > valuePoint.date - 100);
		stock.timeline.push(valuePoint);
		return await StockModel.findByIdAndUpdate(_id, stock).exec();
	};
	const getRandomStocks = async (count: number) => {
		const stocks = await StockModel.find({}, { _id: 1 }).limit(count).exec();
		return stocks.map((stock) => stock._id);
	};
	const getHighSlopeStocks = async (count: number) => {
		const stocks = await getStocks();
		stocks.sort((a, b) => b.slope - a.slope);
		return stocks.slice(0, count).map((stock) => stock._id);
	};
	const getHighDoubleSlopeStocks = async (count: number) => {
		const stocks = await getStocks();
		stocks.sort((a, b) => b.double_slope - a.double_slope);
		return stocks.slice(0, count).map((stock) => stock._id);
	};

	return {
		changeVolume,
		addStock,
		getStocks,
		getStock,
		addPoint,
		getRandomStocks,
		getHighSlopeStocks,
		getHighDoubleSlopeStocks,
	};
})();
export default StockService;
