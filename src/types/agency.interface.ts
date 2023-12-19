import { ObjectId } from "mongoose";

export enum AGENCY_TYPES {
    "Steady" = "Steady",
    "Trendy" = "Trendy",
    "Random" = "Random",
    "Aggressive" = "Aggressive",
}

export type AGENCY_TYPE = keyof typeof AGENCY_TYPES;

interface AgencyInterface {
    type: AGENCY_TYPE;
    stock: string | ObjectId;
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
