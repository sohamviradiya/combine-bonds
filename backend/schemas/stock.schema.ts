import { ValuePoint } from "backend/interfaces/stock.interface";
import mongoose, { Schema } from "mongoose";

const StockSchema = new Schema({
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

StockSchema.virtual("price").get(function (this: any) {
	const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
	return Number(last_point.market_valuation) / this.gross_volume;
});

StockSchema.virtual("slope").get(function (this: any) {
	const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
	const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
	return (
		(Number(last_point.market_valuation) -
			Number(second_last_point.market_valuation)) /
		Number(second_last_point.market_valuation)
	);
});

StockSchema.virtual("double_slope").get(function (this: any) {
	const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
	const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
	const third_last_point: ValuePoint = this.timeline[this.timeline.length - 3];
	const last_slope =
		(Number(last_point.market_valuation) -
			Number(second_last_point.market_valuation)) /
		Number(second_last_point.market_valuation);
	const second_last_slope =
		(Number(second_last_point.market_valuation) -
			Number(third_last_point.market_valuation)) /
		Number(third_last_point.market_valuation);
	return (last_slope - second_last_slope) / second_last_slope;
});

const StockModel = mongoose.model("Stock", StockSchema);
export default StockModel;
