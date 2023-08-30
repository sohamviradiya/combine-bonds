export enum AGENCY_CLASS {
    "Steady" = "Steady",
    "Trendy" = "Trendy",
    "Random" = "Random",
    "Aggressive" = "Aggressive",
}

type AgencyInterface = {
    agency_class: keyof typeof AGENCY_CLASS;
    stock: string;
    market_valuation_parameter: {
        steady_increase: number;
        random_fluctuation: number;
        market_sentiment_dependence_parameter: number;
        market_volume_dependence_parameter: number;
        dividend_ratio: number;
    };
};

export type AgencyInterfaceWithId = AgencyInterface & {
    _id: string;
};

export default AgencyInterface;