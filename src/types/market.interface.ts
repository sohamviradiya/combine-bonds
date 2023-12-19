import { ObjectId } from "mongoose";

interface MarketInterface {
    date: number;
    cumulative_market_capitalization: number;
    cumulative_net_worth: number;
    market_sentience_index: number;
    trending_stocks: string[] | ObjectId[];
    predicted_stocks: string[] | ObjectId[];
};

export default MarketInterface;
