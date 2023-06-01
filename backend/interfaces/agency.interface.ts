export enum AGENCY_CLASS {
	"Steady", // low random fluctuation, low market sentiment dependence, low volume dependence
	"Trendy", // high market sentiment dependence, low volume dependence,
	"Random", // high random fluctuation, low market sentiment dependence, low volume dependence
	"Aggressive", // high volume dependence, high market sentiment dependence
}

type AgencyInterface = {
	class: keyof typeof AGENCY_CLASS;
	stock: string;
	market_valuation_parameter: {
		steady_increase: number;
		random_fluctuation: number;
		market_sentiment_dependence_parameter: number;
		market_volume_dependence_parameter: number;
	};
};

export type AgencyInterfaceWithId = AgencyInterface & {
	_id: string;
};

export default AgencyInterface;
