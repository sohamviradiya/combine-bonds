export enum AGENCY_CLASS {
    "Steady" = "Steady",
    "Trendy" = "Trendy",
    "Random" = "Random",
    "Aggressive" = "Aggressive",
}

export type AGENCY_CLASS_TYPE = keyof typeof AGENCY_CLASS;

interface AgencyInterface {
    type: AGENCY_CLASS_TYPE;
    stock: string;
    parameters: {
        steady_increase: number;
        random_fluctuation: number;
        market_sentiment: number;
        market_volume: number;
        dividend: number;
    };
};

export type AgencyInterfaceWithId = AgencyInterface & {
    _id: string;
};

export default AgencyInterface;
