import CompanyModel from "backend/models/company.schema";
import StockService from "backend/services/stock.service";
import { createStockDto, STOCK_CLASS, StockInterfaceWithID } from "backend/interfaces/stock.interface";
import StockModel from "backend/models/stock.schema";

const StockGenerator = async () => {
	const company_ids = (await CompanyModel.find({}, { _id: 1 }).exec()).map((company: { _id: string }) => company._id);
	return [...(await AddRandomStocks(company_ids, "Voting")), ...(await AddRandomStocks(company_ids, "Bond"))];
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
	return await Promise.all(
		company_ids.map(async (company_id): Promise<StockInterfaceWithID> => {
			const stock = await generateStock(company_id, stock_class);
			return (await StockService.add(stock)) as StockInterfaceWithID;
		})
	);
};

const AddRandomPrices = async () => {
	const stock_ids = await StockModel.find({}, { _id: 1, timeline: 1 }).exec();
	Promise.all(
		stock_ids.map(
			async (stock: {
				_id: string;
				timeline: { date: number; market_valuation: number; volume_in_market: number }[];
			}) => {
				const timeline = stock.timeline.sort((a, b) => a.date - b.date);
				const new_date = timeline[timeline.length - 1].date + 1;
				const new_market_valuation = timeline[timeline.length - 1].market_valuation * (1 + 0.1 * (Math.random() - 0.5));
				return await StockService.addPoint(stock._id, {
					date: new_date,
					market_valuation: new_market_valuation,
					volume_in_market: timeline[timeline.length - 1].volume_in_market,
				});
			}
		)
	);
};

export { AddRandomPrices };

export default StockGenerator;
