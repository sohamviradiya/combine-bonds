import CompanyModel from "backend/models/company.schema";
import StockService from "backend/services/stock.service";
import {
	createStockDto,
	STOCK_CLASSES,
	StockInterfaceWithID,
} from "backend/interfaces/stock.interface";

const StockGenerator = async () => {
	const company_ids = (await CompanyModel.find({}, { _id: 1 }).exec()).map(
		(company: { _id: string }) => company._id
	);
	return [
		...(await AddRandomStocks(company_ids, "Voting")),
		...(await AddRandomStocks(company_ids, "Bond")),
	];
};

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
			"$" + String(company.name).toUpperCase().slice(0, 4) + " " + stock_class,
		class: stock_class,
		company: company._id,
		initial_value: {
			date: 0,
			market_valuation: Math.floor(Math.random() * 1000000000),
			volume_in_market: Math.floor(Math.random() * 10000000),
		},
	} as createStockDto;
};
const AddRandomStocks = async (
	company_ids: string[],
	stock_class: keyof typeof STOCK_CLASSES
) => {
	return await Promise.all(
		company_ids.map(async (company_id): Promise<StockInterfaceWithID> => {
			const stock = await generateRandomStock(
				company_id,
				stock_class
			);
			return (await StockService.addStock(stock)) as StockInterfaceWithID;
		})
	);
};


export default StockGenerator;
