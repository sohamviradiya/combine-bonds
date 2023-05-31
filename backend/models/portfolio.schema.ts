import mongoose, { Schema } from "mongoose";

const PortfolioSchema = new Schema({
	user: {
		type: {
			name: {
				type: Schema.Types.String,
				required: true,
			},
			bio: {
				type: Schema.Types.String,
				required: false,
			},
		},
		required: false,
	},
	transactions: {
		type: [
			{
				class: {
					type: Schema.Types.String,
					required: true,
					enum: [
						"Account Withdrawal",
						"Account Deposit",
						"Stock Purchase",
						"Stock Sale"
					],
				},
				stock: {
					type: Schema.Types.ObjectId,
					ref: "Stock",
					required: false,
				},
				amount: {
					type: Schema.Types.Number,
					required: true,
				},
				date: {
					type: Schema.Types.Number,
					required: true,
				},
			},
		],
	},
	currentBalance: {
		type: Schema.Types.Decimal128,
		required: true,
	},
	netWorth: {
		type: [
			{
				value: {
					type: Schema.Types.Decimal128,
					required: true,
				},
				date: {
					type: Schema.Types.Number,
					required: true,
				},
			},
		],
	},
	investments: {
		type: [
			{
				stock: {
					type: Schema.Types.ObjectId,
					ref: "Stock",
				},
				quantity: {
					type: Schema.Types.Number,
				},
			},
		],
	},
});

export default  mongoose.models["Portfolio"] ??
	mongoose.model("Portfolio", PortfolioSchema);