import mongoose, { Schema } from "mongoose";

const BotSchema = new Schema({
	bot_class: {
		type: Schema.Types.String,
		required: true,
		enum: ["Safe", "Aggressive", "Speculative", "Random"],
	},
	trade_period: {
		type: Schema.Types.Number,
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
				type: Schema.Types.Number,
				required: true,
			},
			market_sentiment_dependence_parameter: {
				type: Schema.Types.Number,
				required: true,
			},
		},
		bundle_expansion_parameter: {
			value: {
				type: Schema.Types.Number,
				required: true,
			},
			high_raise_investment_parameters: {
				value: {
					type: Schema.Types.Number,
					required: true,
				},
				weight_distribution: {
					type: [
						{
							type: Schema.Types.Number,
							required: true,
						},
					],
				},
			},
			lows_rising_investment_parameters: {
				value: {
					type: Schema.Types.Number,
					required: true,
				},
				weight_distribution: {
					type: [
						{
							type: Schema.Types.Number,
							required: true,
						},
					],
				},
			},
			random_investment_parameters: {
				value: {
					type: Schema.Types.Number,
					required: true,
				},
				weight_distribution: {
					type: [
						{
							type: Schema.Types.Number,
							required: true,
						},
					],
				},
			},
		},
		bundle_filling_parameter: {
			value: {
				type: Schema.Types.Number,
				required: true,
			},
			weight_distribution: {
				type: [
					{
						type: Schema.Types.Number,
						required: true,
					},
				],
			},
		},
		loss_aversion_parameter: {
			type: Schema.Types.Number,
			required: true,
		},
	},
});

const BotModel = mongoose.models["Bot"] ?? mongoose.model("Bot", BotSchema);

export default BotModel;
