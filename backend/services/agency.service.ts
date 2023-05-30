import AgencyInterface from "backend/interfaces/agency.interface";
import { AGENCY_CLASS } from "backend/interfaces/agency.interface";
import StockService from "backend/services/stock.service";
import AgencyModel from "backend/models/agency.schema";
const AgencyService = (() => {
	const generateAgency = async (stock_id: string): Promise<AgencyInterface> => {
		const stock = await StockService.getStock(stock_id);
		const agency_class =
			stock.class == "Bond"
				? "Steady"
				: Object.values(AGENCY_CLASS)[Math.floor(Math.random() * 4)];
		let steady_increase = 0;
		let random_fluctuation = 0;
		let market_sentiment_dependence_parameter = 0;
		let market_volume_dependence_parameter = 0;

		if (agency_class == "Steady") {
			steady_increase = 0.35 + Math.random() * 0.1;
			random_fluctuation = 0.05 + Math.random() * 0.1;
			market_sentiment_dependence_parameter = 0.15 + Math.random() * 0.1;
			market_volume_dependence_parameter = 0.2 + Math.random() * 0.1;
		} else if (agency_class == "Trendy") {
			steady_increase = 0.1 + Math.random() * 0.1;
			random_fluctuation = 0.2 + Math.random() * 0.1;
			market_sentiment_dependence_parameter = 0.45 + Math.random() * 0.1;
			market_volume_dependence_parameter = 0.25 + Math.random() * 0.1;
		} else if (agency_class == "Random") {
			steady_increase = 0.1 + Math.random() * 0.1;
			random_fluctuation = 0.6 + Math.random() * 0.1;
			market_sentiment_dependence_parameter = 0.1 + Math.random() * 0.1;
			market_volume_dependence_parameter = 0.2 + Math.random() * 0.1;
		} else if (agency_class == "Aggressive") {
			steady_increase = 0.1 + Math.random() * 0.1;
			random_fluctuation = 0.1 + Math.random() * 0.1;
			market_sentiment_dependence_parameter = 0.3 + Math.random() * 0.1;
			market_volume_dependence_parameter = 0.5 + Math.random() * 0.1;
		}
		return {
			class: agency_class,
			stock: stock_id,
			market_valuation_parameter: {
				steady_increase,
				random_fluctuation,
				market_sentiment_dependence_parameter,
				market_volume_dependence_parameter,
			},
		} as AgencyInterface;
	};
	const addAgency = async (agency: AgencyInterface) => {
		const newAgency = new AgencyModel({
			...agency,
		});
		return await newAgency.save();
	};
	const getAgencies = async () => {
		return await AgencyModel.find({}).exec();
	};
	const getAgency = async (agency_id: string) => {
		return await AgencyModel.findById(agency_id).exec();
	};
	return {
		generateAgency,
		addAgency,
		getAgencies,
		getAgency,
	};
})();

export default AgencyService;
