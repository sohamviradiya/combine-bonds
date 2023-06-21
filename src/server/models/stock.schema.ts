import {
	DIVIDEND_FACTOR,
	STOCK_CLASS,
	ValuePoint,
} from "types/stock.interface";
import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema(
	{
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
						type: Schema.Types.Number,
						required: true,
					},
					market_valuation: {
						type: Schema.Types.Number,
						required: true,
					},
					volume_in_market: {
						type: Schema.Types.Number,
						required: true,
					},
					dividend: {
						type: Schema.Types.Number,
						required: true,
					},
				},
			],
		},
		class: {
			type: Schema.Types.String,
			required: true,
			enum: Object.values(STOCK_CLASS),
		},
		createdAt: {
			type: Schema.Types.Date,
			required: false,
		},
		company: {
			type: Schema.Types.ObjectId,
			ref: "Company",
			required: true,
		},
		traders: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "Portfolio",
					required: true,
				},
			],
		},
	},
	{ toJSON: { virtuals: true } }
);

stockSchema.virtual("price").get(function (this: any) {
	if (this.timeline.length < 1) return 0;
	const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
	return Number(last_point.market_valuation) / this.gross_volume;
});

stockSchema.virtual("slope").get(function (this: any) {
	if (this.timeline.length < 2) return 0;
	const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
	const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
	return (
		(Number(last_point.market_valuation) -
			Number(second_last_point.market_valuation)) /
		Number(second_last_point.market_valuation)
	);
});

stockSchema.virtual("double_slope").get(function (this: any) {
	if (this.timeline.length < 3) return 0;
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

stockSchema.virtual("fall_since_peak").get(function (this: any) {
	if (this.timeline.length < 2) return 0;
	const latest_market_valuation =
		this.timeline[this.timeline.length - 1].market_valuation;
	let k = this.timeline.length - 2;
	while (
		k >= 0 &&
		this.timeline[k].market_valuation >= this.timeline[k + 1].market_valuation
	)
		k--;
	return (
		(Number(this.timeline[k + 1].market_valuation) -
			Number(latest_market_valuation)) /
		Number(this.timeline[k + 1].market_valuation)
	);
});

stockSchema.virtual("rise_since_trough").get(function (this: any) {
	if (this.timeline.length < 2) return 0;
	const latest_market_valuation =
		this.timeline[this.timeline.length - 1].market_valuation;
	let k = this.timeline.length - 2;
	while (
		k >= 0 &&
		this.timeline[k].market_valuation <= this.timeline[k + 1].market_valuation
	)
		k--;
	return (
		(Number(latest_market_valuation) -
			Number(this.timeline[k + 1].market_valuation)) /
		Number(this.timeline[k + 1].market_valuation)
	);
});

const StockModel =
	mongoose.models["Stock"] ?? mongoose.model("Stock", stockSchema);

export default StockModel;
