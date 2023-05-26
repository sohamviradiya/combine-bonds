import StockModel from "backend/models/stock.schema";
import StockInterface, { ValuePoint } from "backend/interfaces/stock.interface";

const StockService = (() => {
	const addStock = async (stock: StockInterface) => {
		const newStock = new StockModel(stock);
		const newStockDoc = await newStock.save().exec();
		return newStockDoc;
	};
	const getStocks = async () => {
		const data = await StockModel.find().exec();
		console.log(data);
		return data;
	};
	const getStock = async (_id: string) => {
		const stock = await StockModel.findById(_id).exec();
		return stock;
	};
	const addPoint = async (_id: string, valuePoint: ValuePoint) => {
		const stock = await StockModel.findById(_id).exec();
		stock?.timeline.push(valuePoint);
		stock?.timeline.pop();
		const updatedStock = await stock?.save();
		return updatedStock;
	};
	return {
		addStock,
		getStocks,
		getStock,
		addPoint,
	};
})();

export default StockService;
