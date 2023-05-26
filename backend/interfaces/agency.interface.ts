export enum AGENCY_CLASS {
	"Steady", // low random fluctuation, low market sentiment dependence, low volume dependence
	"Trendy", // high market sentiment dependence, low volume dependence,
	"Random", // high random fluctuation, low market sentiment dependence, low volume dependence
	"Aggressive", // high volume dependence, high market sentiment dependence
}

type agencyInterface = {
	name: String;
	class: AGENCY_CLASS;
	stock: String;
	market_valuation_parameter: {
		steady_increase: Number;
		random_fluctuation: Number;
		market_sentiment_dependence_parameter: Number;
		market_volume_dependence_parameter: Number;
	};
	
};

export default agencyInterface;
