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
		const newStock = {
			...stock,
			createdAt: new Date(),
		} as StockInterface;
		const newStockDoc = await new StockModel({ ...newStock }).save();
		await CompanyModel.findByIdAndUpdate(stock.company, {
			$push: { stocks: newStockDoc._id },
		}).exec();
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
		return {
			...data._doc,
			price: data.price,
			slope: data.slope,
			double_slope: data.double_slope,
		};
	};

	const addPoint = async (_id: string, valuePoint: ValuePoint) => {
		const stock: StockInterfaceWithID = await StockModel.findById(_id).exec();
		if (!stock) return null;
		stock.timeline = stock.timeline.filter(
			(point) => point.date < valuePoint.date - 100
		);
		stock.timeline.push(valuePoint);
		return await StockModel.findByIdAndUpdate(_id, stock).exec();
	};
	return {
		addStock,
		getStocks,
		getStock,
		addPoint,
	};
})();

export default StockService;
