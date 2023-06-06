import mongoose, { Schema } from "mongoose";

const AgencySchema = new Schema({
	agency_class: {
		type: Schema.Types.String,
		required: true,
		enum: ["Steady", "Trendy", "Random", "Aggressive"],
	},
	stock: {
		type: Schema.Types.ObjectId,
		ref: "Stock",
		required: true,
	},
	market_valuation_parameter: {
		steady_increase: {
			type: Schema.Types.Number,
			required: true,
		},
		random_fluctuation: {
			type: Schema.Types.Number,
			required: true,
		},
		market_sentiment_dependence_parameter: {
			type: Schema.Types.Number,
			required: true,
		},
		market_volume_dependence_parameter: {
			type: Schema.Types.Number,
			required: true,
		},
	},
});
const AgencyModel = mongoose.models["Agency"] ?? mongoose.model("Agency", AgencySchema);
export default AgencyModel;
