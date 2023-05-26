export enum COMPANY_FIELDS {
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
}

export enum COMPANY_FORMS {
	"Sole Proprietorship",
	"Partnership",
	"Corporation",
	"Cooperative",
	"Franchise",
	"Joint Venture",
	"Other",
}

export enum COMPANY_STOCK_CLASSES {
	"Voting",
	"Non-Voting",
	"Bond",
	"Debenture",
}

type companyInterface = {
	name: String;
	field: COMPANY_FIELDS;
	form: COMPANY_FORMS;
	established: Date;
	description: String;
	assets: Number;
	stocks: [
		{
			class: COMPANY_STOCK_CLASSES;
			info: String;
		}
	];
	headquarters?: String;
	employees?: Number;
	website?: String;
	market_capitalization: Number;
};

export default companyInterface;
