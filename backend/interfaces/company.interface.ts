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

type companyInterface = {
	name: String;
	field: COMPANY_FIELDS;
	form: COMPANY_FORMS;
	established?: Date;
	description?: String;
	assets: Number;
	stocks: [String];
	headquarters?: String;
	employees?: Number;
	website?: String;
	market_capitalization: Number;
};

export type companyInterfaceWithId = companyInterface & {
	_id: String;
};

export type createCompanyDto = Omit<companyInterface, "stocks">;

export default companyInterface;
