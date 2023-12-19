import MarketInterface from "@/types/market.interface";
import mongoose, { Schema } from "mongoose";

const MarketSchema = new Schema<MarketInterface>({
    date: {
        type: Schema.Types.Number,
        required: true,
    },
    cumulative_market_capitalization: {
        type: Schema.Types.Number,
        required: true,
    },
    cumulative_net_worth: {
        type: Schema.Types.Number,
        required: true,
    },
    market_sentience_index: {
        type: Schema.Types.Number,
        required: true,
    },
    trending_stocks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Stock",
            required: true,
        }],
        default: [],
    },
    predicted_stocks: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Stock",
            required: true,
        }],
        default: [],
    },
}, { toJSON: { virtuals: true } });

const MarketModel = mongoose.models["Market"] as mongoose.Model<MarketInterface> ?? mongoose.model<MarketInterface>("Market", MarketSchema);

export default MarketModel;

