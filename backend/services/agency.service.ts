import AgencyInterface, { INTENSITY_CONSTANT } from "backend/interfaces/agency.interface";
import AgencyModel from "backend/models/agency.schema";
import StockModel from "backend/models/stock.schema";
import MarketService from "./market.service";
import StockService from "./stock.service";
import { StockInterfaceWithID } from "backend/interfaces/stock.interface";

const AgencyService = (() => {
	const add = async (agency: AgencyInterface) => {
		const newAgency = new AgencyModel({
			...agency,
		});
		return await newAgency.save();
	};
	const getAll = async () => {
		return (await AgencyModel.find({}, { _id: 1 }).exec()).map((agency) => String(agency._id));
	};

	const get = async (agency_id: string) => {
		return await AgencyModel.findById(agency_id).exec();
	};
	const evaluate = async (agency_id: string) => {
		console.log("Evaluating agency " + agency_id);
		const agency = await get(agency_id);
		const parameters = agency.market_valuation_parameter;
		const data = await StockModel.findById(agency.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithID;

		let market_valuation = stock.timeline[stock.timeline.length - 1].market_valuation;
		market_valuation = (1 + INTENSITY_CONSTANT * parameters.steady_increase) * market_valuation;

		const random_num = 2 * (Math.random() - 0.5);
		market_valuation = (1 + INTENSITY_CONSTANT * parameters.random_fluctuation * random_num) * market_valuation;

		const market_sentiment = await MarketService.getRelativeCumulativeNetWorth();
		market_valuation =
			(1 + INTENSITY_CONSTANT * parameters.market_sentiment_dependence_parameter * market_sentiment) * market_valuation;

		let volume_change_ratio = 0;
		if (stock.timeline.length < 2) volume_change_ratio = 0;
		else {
			const current_volume = stock.timeline[stock.timeline.length - 1].volume_in_market || 0;
			const previous_volume = stock.timeline[stock.timeline.length - 2].volume_in_market || 0;
			if (previous_volume == 0) volume_change_ratio = 0;
			else volume_change_ratio = (current_volume - previous_volume) / previous_volume;
		}
		market_valuation =
			(1 + INTENSITY_CONSTANT * parameters.market_volume_dependence_parameter * volume_change_ratio) * market_valuation;

		const volume_in_market = stock.timeline[stock.timeline.length - 1].volume_in_market;
		await StockService.addPoint(agency.stock, {
			date: stock.timeline.length,
			market_valuation,
			volume_in_market,
		});
		return market_valuation;
	};

	return { add, getAll, get, evaluate };
})();

export default AgencyService;
