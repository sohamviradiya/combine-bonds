import CompanyModel from "backend/models/company.schema";
import StockService from "backend/services/stock.service";
import { createStockDto, STOCK_CLASS } from "backend/interfaces/stock.interface";

const StockGenerator = async () => {
	const company_ids = (await CompanyModel.find({}, { _id: 1 }).exec()).map((company: { _id: string }) => company._id);
	await AddRandomStocks(company_ids, "Voting");
	await AddRandomStocks(company_ids, "Bond");
};

const generateStock = async (company_id: string, stock_class: keyof typeof STOCK_CLASS): Promise<createStockDto> => {
	const company: {
		name: string;
		_id: string;
	} = await CompanyModel.findById(company_id).exec();
	const gross_volume = Math.floor((0.1 + Math.random()) * Math.pow(10, 7 + 3 * Math.random()));
	const market_valuation = gross_volume * (0.1 + Math.random()) * 100;
	return {
		name: "$" + String(company.name).toUpperCase().slice(0, 4) + " " + stock_class,
		class: stock_class,
		company: company._id,
		gross_volume,
		timeline: [
			{
				date: 0,
				market_valuation,
				volume_in_market: 0,
			},
		],
	} as createStockDto;
};
const AddRandomStocks = async (company_ids: string[], stock_class: keyof typeof STOCK_CLASS) => {
	Promise.all(
		company_ids.map(async (company_id) => {
			const stock = await generateStock(company_id, stock_class);
			await StockService.add(stock);
		})
	);
};

export default StockGenerator;
