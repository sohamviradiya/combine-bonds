import AgencyInterface, {
	AgencyInterfaceWithId,
	AGENCY_PRICE_INCREMENT_PARAMETER,
} from "server/types/agency.interface";
import AgencyModel from "server/models/agency.schema";
import StockModel from "server/models/stock.schema";
import MarketService from "./market.service";
import StockService from "./stock.service";
import { StockInterfaceWithID } from "server/types/stock.interface";

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
		const agency = await get(agency_id);
		const parameters = agency.market_valuation_parameter;
		const stock = await StockModel.findById(agency.stock).exec();

		let increase_coefficient = 0;
		increase_coefficient += parameters.steady_increase;

		const random_num = 2 * (Math.random() - 0.5);
		increase_coefficient = parameters.random_fluctuation * random_num;

		const market_sentiment = await MarketService.getRelativeCumulativeNetWorth();
		increase_coefficient += parameters.market_sentiment_dependence_parameter * market_sentiment;

		let volume_change_ratio = 0;
		if (stock.timeline.length < 2) volume_change_ratio = 1;
		else {
			const current_volume = Number(stock.timeline[stock.timeline.length - 1].volume_in_market);
			const previous_volume = Number(stock.timeline[stock.timeline.length - 2].volume_in_market);
			if (previous_volume === 0) volume_change_ratio = current_volume !== 0 ? 1 : 0;
			else volume_change_ratio = (current_volume - previous_volume) / previous_volume;
		}
		increase_coefficient += parameters.market_volume_dependence_parameter * volume_change_ratio;

		let market_valuation = stock.timeline[stock.timeline.length - 1].market_valuation;

		market_valuation *= 1 + increase_coefficient * AGENCY_PRICE_INCREMENT_PARAMETER;

		const volume_in_market = stock.timeline[stock.timeline.length - 1].volume_in_market;
		await StockService.addPoint(agency.stock, {
			date: 0,
			market_valuation,
			volume_in_market,
		});
		return market_valuation;
	};

	return { add, getAll, get, evaluate };
})();

export default AgencyService;
