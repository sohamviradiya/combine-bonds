export enum AGENCY_CLASS {
	"Steady",
	"Trendy",
	"Random",
	"Aggressive",
}

const INTENSITY_CONSTANT = 0.05;

type AgencyInterface = {
	agency_class: keyof typeof AGENCY_CLASS;
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

export { INTENSITY_CONSTANT };
export default AgencyInterface;
