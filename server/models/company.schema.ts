import mongoose, { Schema } from "mongoose";
import { COMPANY_FIELDS, COMPANY_FORMS } from "server/types/company.interface";
import { STOCK_CLASS } from "server/types/stock.interface";
const CompanySchema = new Schema({
	name: {
		type: Schema.Types.String,
		required: true,
	},
	field: {
		type: Schema.Types.String,
		required: true,
		enum: Object.values(COMPANY_FIELDS),
	},
	form: {
		type: Schema.Types.String,
		required: true,
		enum: Object.values(COMPANY_FORMS),
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
		type: Schema.Types.Number,
		required: true,
	},
	stocks: {
		type: [
			{
				ref: {
					type: Schema.Types.ObjectId,
					ref: "Stock",
					required: true,
				},
				class: {
					type: Schema.Types.String,
					required: true,
					enum: Object.values(STOCK_CLASS),
				},
			},
		],
	},
	headquarters: {
		type: Schema.Types.String,
		required: true,
	},
	employees: {
		type: Schema.Types.Number,
		required: false,
	},
	market_capitalization: {
		type: Schema.Types.Number,
		required: true,
	},
});

const CompanyModel = mongoose.models["Company"] ?? mongoose.model("Company", CompanySchema);

export default CompanyModel;
