import mongoose, { Schema } from "mongoose";
import { EXPORT_DETAIL } from "next/dist/shared/lib/constants";

const AgencySchema = new Schema({
	class: {
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
			type: Schema.Types.Decimal128,
			required: true,
		},
		random_fluctuation: {
			type: Schema.Types.Decimal128,
			required: true,
		},
		// relative change in market sentiment + relative change in volume
		market_sentiment_dependence_parameter: {
			// compared to the last slot
			type: Schema.Types.Decimal128,
			required: true,
		},
		market_volume_dependence_parameter: {
			// compared to the last slot
			type: Schema.Types.Decimal128,
			required: true,
		},
	},
});
const AgencyModel = mongoose.models["Agency"] ??
	mongoose.model("Agency", AgencySchema);
export default AgencyModel;