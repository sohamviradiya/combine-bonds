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
						"Stock Sale",
						"Stock Dividend",
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
					type: Schema.Types.Date,
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
					required: false,
				},
				date: {
					type: Schema.Types.Date,
					required: false,
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

const PortfolioModel = mongoose.model("Portfolio", PortfolioSchema);
export default PortfolioModel;