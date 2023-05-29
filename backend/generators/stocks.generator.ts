import CompanyModel from "backend/models/company.schema";
import {
	STOCK_CLASSES,
	StockInterface,
	StockInterfaceWithID,
} from "backend/interfaces/stock.interface";
import StockService from "backend/services/stock.service";

export default async () => {
	const company_ids = (await CompanyModel.find({}, { _id: 1 }).exec()).map(
		(company: { _id: string }) => company._id
	);
	const stocks = await gen_stocks(company_ids, "Bond");
	stocks.push(...(await gen_stocks(company_ids, "Voting")));
	return stocks;
};
const gen_stocks = async (
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
