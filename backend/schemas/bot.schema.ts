import mongoose, { Schema } from "mongoose";

const botSchema = new Schema({
	class: {
		type: Schema.Types.String,
		required: true,
		enum: [
			"Safe-investing",
			"Aggressive-investing",
			"Speculative-investing",
			"Day-trading",
		],
	},
	trade_period: {
		type: Schema.Types.Number, // in slots (1 slot = 15 minute)
		required: true,
	},
	portfolio: {
		type: Schema.Types.ObjectId,
		ref: "Portfolio",
		required: true,
	},
	parameters: {
		investment_amount_per_slot: {
			balance_dependence_parameter: {
				//% of total account balance (<1%) * relative increase in market cap during last slot
				type: Schema.Types.Decimal128,
				required: true,
			},
			market_sentiment_dependence_parameter: {
				type: Schema.Types.Decimal128,
				required: true,
			},
		},
		bundle_expansion: {
			parameter: {
				type: Schema.Types.Decimal128,
				required: true,
			},
			high_raise_investment_parameters: {
				parameter: {
					// top-n stocks
					type: Schema.Types.Decimal128,
					required: true,
				},
				weight_distribution: {
					type: [
						{
							type: Schema.Types.Decimal128,
							required: true,
						}, // sum of weights = 1
					],
				},
			},
			lows_rising_investment_parameters: {
				parameter: {
					// top-n stock with d/dt(price) ~ 0 and d2/dt2(price) > 0
					required: true,
				},
				weight_distribution: {
					type: [
						{
							type: Schema.Types.Decimal128,
							required: true,
						}, // sum of weights = 1
					],
				},
			},
			random_investment_parameters: {
				parameter: {
					// random-n stocks
					type: Schema.Types.Decimal128,
					required: true,
				},
				weight_distribution: {
					type: [
						{
							type: Schema.Types.Decimal128,
							required: true,
						},
					],
				},
			},
		},
		bundle_filling: {
			parameter: {
				// increasing investment in the existing bundle
				type: Schema.Types.Decimal128,
				required: true,
			},
			weight_distribution: {
				type: [
					{
						type: Schema.Types.Decimal128,
						required: true,
					},
				],
			},
			loss_aversion_parameter: {
				type: [
					{
						reference_price: {
							type: Schema.Types.Decimal128,
							required: true,
						},
						tolerable_relative_loss: {
							type: Schema.Types.Decimal128,
							required: true,
						},
					},
				],
			},
		},
		// bundle filling + bundle expansion = 1
	},
});

export default mongoose.model("Bot", botSchema);
