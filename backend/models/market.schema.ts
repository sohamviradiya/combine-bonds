import mongoose, { Schema } from "mongoose";

const MarketSchema = new Schema({
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
}, { toJSON: { virtuals: true } });

const MarketModel = mongoose.models["Market"] ?? mongoose.model("Market", MarketSchema);

export default MarketModel;