import mongoose, { Schema } from "mongoose";
import { TRANSACTION_CLASS } from "../types/portfolio.interface";
const PortfolioSchema = new Schema({
	user: {
		type: {
			name: {
				type: Schema.Types.String,
				required: true,
				unique: true,
			},
			bio: {
				type: Schema.Types.String,
				required: false,
			},
			password: {
				type: Schema.Types.String,
				required: true,
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
					enum: Object.values(TRANSACTION_CLASS),
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
		type: Schema.Types.Number,
		required: true,
	},
	netWorth: {
		type: [
			{
				value: {
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

const PortfolioModel =
	mongoose.models["Portfolio"] ?? mongoose.model("Portfolio", PortfolioSchema);

export default PortfolioModel;