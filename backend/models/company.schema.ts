import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: true,
	},
	field: {
		type: Schema.Types.String,
		required: true,
		enum: [
			"Agriculture",
			"Mining",
			"Construction",
			"Manufacturing",
			"Transportation",
			"Communication",
			"Entertainment",
			"Utilities",
			"Finance",
			"Real Estate",
			"Insurance",
			"Wholesale",
			"Retail",
			"Public Administration",
		],
	},
	form: {
		type: Schema.Types.String,
		required: true,
		enum: [
			"Sole Proprietorship",
			"Partnership",
			"Corporation",
			"Cooperative",
			"Franchise",
			"Joint Venture",
			"Other",
		],
	},
	established: {
		type: Schema.Types.Date,
		required: true,
	},
	description: {
		type: Schema.Types.String,
		required: true,
	},
	assets: {
		type: Schema.Types.Decimal128,
		required: true,
	},
	stocks: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: "Stock",
				required: true,
			},
		],
	},
	headquarters: {
		type: Schema.Types.String,
		required: true,
	},
	employees: {
		type: Schema.Types.Number,
		required: true,
	},
	market_capitalization: {
		type: Schema.Types.Number,
		required: true,
	},
});

export default mongoose.models["Company"] ??
	mongoose.model("Company", CompanySchema);
