import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: true,
	},
	gross_volume: {
		type: Schema.Types.Number,
		required: true,
	},
	timeline: {
		type: [
			{
				date: {
					type: Schema.Types.Date,
					required: true,
				},
				market_valuation: {
					type: Schema.Types.Number,
					required: true,
				},
				volume_in_market: {
					type: Schema.Types.Number,
					required: true,
				}, // price = market_valuation / volume_in_market
			},
		],
	},
	createdAt: {
		type: Schema.Types.Date,
		required: false,
		default: Date.now,
	},
	company: {
		type: Schema.Types.ObjectId,
		ref: "Company",
		required: true,
	},
});

stockSchema.virtual("price").get(function (this: any) {
	const last_point: {
		date: Date;
		market_valuation: Number;
		volume_in_market: Number;
	} = this.timeline[this.timeline.length - 1];
	return Number(last_point.market_valuation) / this.gross_volume;
});

export default mongoose.model("Stock", stockSchema);
