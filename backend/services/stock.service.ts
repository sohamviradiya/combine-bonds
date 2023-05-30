import StockModel from "backend/models/stock.schema";
import {
	ValuePoint,
	createStockDto,
	STOCK_CLASSES,
	StockInterface,
	StockInterfaceWithID,
} from "backend/interfaces/stock.interface";
import CompanyModel from "backend/models/company.schema";
import { faker } from "@faker-js/faker";
const StockService = (() => {
	const generateRandomStock = async (
		company_id: string,
		stock_class: keyof typeof STOCK_CLASSES
	): Promise<createStockDto> => {
		const company: {
			name: string;
			_id: string;
		} = await CompanyModel.findById(company_id).exec();
		return {
			name:
				"$" +
				String(company.name).toUpperCase().slice(0, 4) +
				" " +
				stock_class,
			class: stock_class,
			company: company._id,
			initial_value: {
				date: 0,
				market_valuation: Math.floor(Math.random() * 1000000000),
				volume_in_market: Math.floor(Math.random() * 1000000),
			},
		} as createStockDto;
	};
	const AddRandomStocks = async (
		company_ids: string[],
		stock_class: keyof typeof STOCK_CLASSES
	) => {
		return await Promise.all(
			company_ids.map(async (company_id): Promise<StockInterfaceWithID> => {
				const stock = await StockService.generateRandomStock(
					company_id,
					stock_class
				);
				return (await StockService.addStock(stock)) as StockInterfaceWithID;
			})
		);
	};
	const addStock = async (stock: createStockDto) => {
		const newStock = {
			...stock,
			timeline: [stock.initial_value],
			gross_volume: 1000000,
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
		return data.map((stock): StockInterfaceWithID => ({
			...stock._doc,
			price: stock.price,
			slope: stock.slope,
			double_slope: stock.double_slope,
		}));
	};
	const getStock = async (_id: string): Promise<StockInterfaceWithID> => {
		return await StockModel.findById(_id).exec();
	};
	const addPoint = async (_id: string, valuePoint: ValuePoint) => {
		const stock = await StockModel.findById(_id).exec();
		if (!stock) return null;
		stock.timeline.unshift(valuePoint);
		stock.timeline.pop();
		const updatedStock = await stock?.save();
		return updatedStock;
	};
	return {
		generateCompanyStock: AddRandomStocks,
		generateRandomStock,
		addStock,
		getStocks,
		getStock,
		addPoint,
	};
})();

export default StockService;
